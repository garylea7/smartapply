import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
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
        status: 'active',
        provider: 'stripe'
      },
    });

    if (!subscription || !subscription.subscriptionId) {
      return NextResponse.json(
        { error: 'No active Stripe subscription found' },
        { status: 404 }
      );
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(subscription.subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update subscription in database
    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: 'cancelled' },
    });

    // Log webhook
    await db.webhookLog.create({
      data: {
        provider: 'stripe',
        eventType: 'subscription.cancelled',
        payload: JSON.stringify({ subscriptionId: subscription.subscriptionId }),
        processed: true,
        userId: payload.userId,
      },
    });

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}