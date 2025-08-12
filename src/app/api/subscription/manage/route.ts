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

    if (!subscription || !subscription.customerId) {
      return NextResponse.json(
        { error: 'No active Stripe subscription found' },
        { status: 404 }
      );
    }

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${process.env.APP_URL || 'http://localhost:3000'}/app/account`,
    });

    return NextResponse.json({
      portalUrl: portalSession.url,
    });
  } catch (error) {
    console.error('Create portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}