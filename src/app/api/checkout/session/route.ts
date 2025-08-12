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

    const { priceId, planName } = await request.json();

    if (!priceId || !planName) {
      return NextResponse.json(
        { error: 'Price ID and plan name are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Map price IDs to actual Stripe price IDs
    const stripePriceMap: Record<string, string> = {
      'price_pro_monthly': process.env.STRIPE_PRICE_PRO_MONTHLY!,
      'price_pro_plus_monthly': process.env.STRIPE_PRICE_PRO_PLUS_MONTHLY!,
      'price_lifetime': process.env.STRIPE_PRICE_LIFETIME!,
    };

    const stripePriceId = stripePriceMap[priceId];
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: priceId === 'price_lifetime' ? 'payment' : 'subscription',
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/app?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        userId: user.id,
        planName: planName,
        priceId: priceId,
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}