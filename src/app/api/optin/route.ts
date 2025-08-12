import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateMagicToken, generateAccessToken, generateUserId } from '@/lib/auth';
import { sendEmail, generateMagicLinkEmail } from '@/lib/email';
import { getResponseService } from '@/lib/getresponse';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          id: generateUserId(),
          email,
          plan: 'FREE',
        },
      });
    }

    // Generate magic link token
    const magicToken = generateMagicToken(email);
    const magicLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify?token=${magicToken}`;

    // Send magic link email
    const emailHtml = generateMagicLinkEmail(email, magicLink);
    await sendEmail({
      to: email,
      subject: 'Welcome to SmartApply - Your Magic Link',
      html: emailHtml,
    });

    // Add to GetResponse
    try {
      const campaignId = process.env.GETRESPONSE_CAMPAIGN_ID; // Set this in your env
      await getResponseService.addContact(
        {
          email,
          tags: ['opt_in', 'free_user'],
        },
        campaignId
      );
    } catch (getResponseError) {
      console.error('GetResponse integration error:', getResponseError);
      // Don't fail the whole process if GetResponse fails
    }

    return NextResponse.json({
      message: 'Welcome! Check your email for your magic link.',
      email: email,
    });
  } catch (error) {
    console.error('Opt-in error:', error);
    return NextResponse.json(
      { error: 'Failed to process opt-in' },
      { status: 500 }
    );
  }
}