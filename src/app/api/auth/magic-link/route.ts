import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateMagicToken, generateAccessToken, generateUserId } from '@/lib/auth';
import { sendEmail, generateMagicLinkEmail } from '@/lib/email';

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
      subject: 'Sign in to SmartApply',
      html: emailHtml,
    });

    return NextResponse.json({
      message: 'Magic link sent to your email',
      email: email,
    });
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}