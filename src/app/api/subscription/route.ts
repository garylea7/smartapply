import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's subscription
    const subscription = await db.subscription.findFirst({
      where: { 
        userId: payload.userId,
        status: { in: ['active', 'trialing', 'cancelled'] }
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json({ 
        message: 'No active subscription found',
        subscription: null 
      });
    }

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
      plan: subscription.plan,
      provider: subscription.provider,
      createdAt: subscription.createdAt,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}