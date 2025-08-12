import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyMagicToken, generateAccessToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify magic token
    const magicTokenPayload = verifyMagicToken(token);
    if (!magicTokenPayload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: magicTokenPayload.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate access token
    const accessToken = generateAccessToken(user.id, user.email, user.plan);

    // Update user email verification status
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    // Create response with access token in cookie
    const response = NextResponse.json({
      message: 'Successfully authenticated',
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
      },
    });

    // Set HTTP-only cookie with access token
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    );
  }
}