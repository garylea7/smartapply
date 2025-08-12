import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const analysisId = params.id;

    // Fetch analysis
    const analysis = await db.analysis.findUnique({
      where: { id: analysisId },
      include: {
        user: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Check if user owns this analysis
    if (analysis.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Parse JSON fields
    const missingKeywords = JSON.parse(analysis.missingKeywords || '[]');
    const improvements = JSON.parse(analysis.improvements || '[]');
    const recommendations = JSON.parse(analysis.recommendations || '[]');

    // Build response based on user plan
    const response: any = {
      id: analysis.id,
      atsScore: analysis.atsScore,
      missingKeywords,
      improvements,
      recommendations,
      userPlan: analysis.user.plan,
      createdAt: analysis.createdAt,
    };

    // Add premium features based on plan
    if (analysis.user.plan !== 'FREE') {
      if (analysis.tailoredResume) {
        response.tailoredResume = JSON.parse(analysis.tailoredResume);
      }
      if (analysis.coverLetter) {
        response.coverLetter = JSON.parse(analysis.coverLetter);
      }
    }

    if (analysis.user.plan === 'PRO_PLUS' || analysis.user.plan === 'LIFETIME') {
      if (analysis.interviewQA) {
        response.interviewQA = JSON.parse(analysis.interviewQA);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}