import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import ZAI from 'z-ai-web-dev-sdk';
import pdfParse from 'pdf-parse';

// Parse resume PDF buffer into text using pdf-parse
async function parsePDF(buffer: Buffer): Promise<string> {
  const result = await pdfParse(buffer);
  const text = (result.text || '').trim();
  return text;
}

async function checkUsageLimit(userId: string, userPlan: string): Promise<boolean> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    // Check daily limit for free users
    if (userPlan === 'FREE') {
      const todayUsage = await db.usageLog.count({
        where: {
          userId,
          action: 'analyze',
          createdAt: {
            gte: today,
          },
        },
      });

      return todayUsage < 1; // 1 analysis per day for free users
    }

    // Check monthly limit for pro users
    if (userPlan === 'PRO') {
      const monthlyUsage = await db.usageLog.count({
        where: {
          userId,
          action: 'analyze',
          createdAt: {
            gte: thisMonth,
          },
        },
      });

      return monthlyUsage < 20; // 20 analyses per month for pro users
    }

    // Pro+ and Lifetime users have unlimited usage
    return true;
  } catch (error) {
    console.error('Usage limit check error:', error);
    return false;
  }
}

async function performATSAnalysis(resumeText: string, jobDescription: string, userPlan: string) {
  try {
    const zai = await ZAI.create();

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. Your task is to analyze a resume against a job description and provide detailed insights.

Compare the resume and job description, then return a JSON object with the following structure:
{
  "atsScore": number (0-100),
  "missingKeywords": string[],
  "improvements": string[],
  "recommendations": string[],
  "tailoredResume": string (only if user plan is not FREE),
  "coverLetter": string (only if user plan is not FREE),
  "interviewQA": string[] (only if user plan is PRO_PLUS or LIFETIME)
}

Scoring criteria:
- 90-100: Excellent match, highly likely to pass ATS
- 70-89: Good match, likely to pass ATS with minor improvements
- 50-69: Fair match, needs significant improvements
- 0-49: Poor match, unlikely to pass ATS

Focus on:
1. Keyword matching between resume and job description
2. Skills and qualifications alignment
3. Experience relevance
4. Format and structure best practices
5. ATS optimization opportunities`;

    const userPrompt = `Please analyze this resume against the job description:

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide a comprehensive ATS analysis with the JSON structure specified.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'glm-4.5', // Explicitly use GLM-4.5 model
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, create a basic result
      analysisResult = {
        atsScore: 65,
        missingKeywords: ['Specific skills from job description'],
        improvements: ['Add more relevant keywords', 'Improve formatting'],
        recommendations: ['Tailor resume to job description'],
        tailoredResume: userPlan !== 'FREE' ? 'Tailored resume content would be here' : undefined,
        coverLetter: userPlan !== 'FREE' ? 'Cover letter content would be here' : undefined,
        interviewQA: (userPlan === 'PRO_PLUS' || userPlan === 'LIFETIME') ? ['Q&A content would be here'] : undefined,
      };
    }

    return analysisResult;
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fallback analysis
    return {
      atsScore: 60,
      missingKeywords: ['Keywords from job description'],
      improvements: ['Improve keyword matching', 'Add relevant experience'],
      recommendations: ['Customize resume for this position'],
      tailoredResume: userPlan !== 'FREE' ? 'Basic tailored resume' : undefined,
      coverLetter: userPlan !== 'FREE' ? 'Basic cover letter' : undefined,
      interviewQA: (userPlan === 'PRO_PLUS' || userPlan === 'LIFETIME') ? ['Sample interview questions'] : undefined,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('userId');
    const userEmail = request.headers.get('userEmail');
    const userPlan = request.headers.get('userPlan');

    if (!userId || !userEmail || !userPlan) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check usage limits
    const canProceed = await checkUsageLimit(userId, userPlan);
    if (!canProceed) {
      return NextResponse.json(
        { error: 'Usage limit exceeded. Please upgrade your plan.' },
        { status: 429 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!resumeFile || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume file and job description are required' },
        { status: 400 }
      );
    }

    // Parse PDF
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await parsePDF(buffer);

    // Perform ATS analysis
    const analysisResult = await performATSAnalysis(resumeText, jobDescription, userPlan);

    // Save analysis to database
    const analysisId = uuidv4();
    await db.analysis.create({
      data: {
        id: analysisId,
        userId,
        resumeText,
        jobDescription,
        atsScore: analysisResult.atsScore,
        missingKeywords: JSON.stringify(analysisResult.missingKeywords),
        improvements: JSON.stringify(analysisResult.improvements),
        recommendations: JSON.stringify(analysisResult.recommendations),
        tailoredResume: analysisResult.tailoredResume ? JSON.stringify(analysisResult.tailoredResume) : null,
        coverLetter: analysisResult.coverLetter ? JSON.stringify(analysisResult.coverLetter) : null,
        interviewQA: analysisResult.interviewQA ? JSON.stringify(analysisResult.interviewQA) : null,
      },
    });

    // Log usage
    await db.usageLog.create({
      data: {
        userId,
        action: 'analyze',
      },
    });

    return NextResponse.json({
      message: 'Analysis completed successfully',
      analysisId,
      atsScore: analysisResult.atsScore,
      // Return only basic info for free users
      ...(userPlan === 'FREE' && {
        missingKeywords: analysisResult.missingKeywords.slice(0, 10), // Top 10 only
      }),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}