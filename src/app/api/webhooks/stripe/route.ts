import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const { userId, planName, priceId } = session.metadata || {};

    if (!userId || !planName || !priceId) {
      console.error('Missing metadata in checkout session');
      return;
    }

    // Map plan names to database enum values
    const planMap: Record<string, 'FREE' | 'PRO' | 'PRO_PLUS' | 'LIFETIME'> = {
      'Pro': 'PRO',
      'Pro+': 'PRO_PLUS',
      'All-In Lifetime': 'LIFETIME',
    };

    const plan = planMap[planName];
    if (!plan) {
      console.error('Invalid plan name:', planName);
      return;
    }

    // Update user plan
    await db.user.update({
      where: { id: userId },
      data: { plan },
    });

    // Create subscription record
    if (session.mode === 'subscription' && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      
      await db.subscription.create({
        data: {
          userId,
          provider: 'stripe',
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          customerId: session.customer as string,
          priceId: priceId,
          subscriptionId: subscription.id,
          plan,
        },
      });
    } else if (session.mode === 'payment') {
      // One-time payment for lifetime plan
      await db.subscription.create({
        data: {
          userId,
          provider: 'stripe',
          status: 'active',
          customerId: session.customer as string,
          priceId: priceId,
          plan,
        },
      });
    }

    // Log webhook
    await db.webhookLog.create({
      data: {
        provider: 'stripe',
        eventType: 'checkout.session.completed',
        payload: JSON.stringify(session),
        processed: true,
        userId,
      },
    });

    console.log(`Successfully processed checkout completion for user ${userId}, plan ${planName}`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Find subscription by subscription ID
    const dbSubscription = await db.subscription.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (!dbSubscription) {
      console.error('Subscription not found in database:', subscription.id);
      return;
    }

    // Update subscription
    await db.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    // Update user plan if subscription is active
    if (subscription.status === 'active') {
      await db.user.update({
        where: { id: dbSubscription.userId },
        data: { plan: dbSubscription.plan },
      });
    } else if (subscription.status === 'cancelled' || subscription.status === 'unpaid') {
      // Downgrade to free plan
      await db.user.update({
        where: { id: dbSubscription.userId },
        data: { plan: 'FREE' },
      });
    }

    // Log webhook
    await db.webhookLog.create({
      data: {
        provider: 'stripe',
        eventType: 'customer.subscription.updated',
        payload: JSON.stringify(subscription),
        processed: true,
        userId: dbSubscription.userId,
      },
    });

    console.log(`Successfully processed subscription update for user ${dbSubscription.userId}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Find subscription by subscription ID
    const dbSubscription = await db.subscription.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (!dbSubscription) {
      console.error('Subscription not found in database:', subscription.id);
      return;
    }

    // Update subscription status
    await db.subscription.update({
      where: { id: dbSubscription.id },
      data: { status: 'cancelled' },
    });

    // Downgrade user to free plan
    await db.user.update({
      where: { id: dbSubscription.userId },
      data: { plan: 'FREE' },
    });

    // Log webhook
    await db.webhookLog.create({
      data: {
        provider: 'stripe',
        eventType: 'customer.subscription.deleted',
        payload: JSON.stringify(subscription),
        processed: true,
        userId: dbSubscription.userId,
      },
    });

    console.log(`Successfully processed subscription deletion for user ${dbSubscription.userId}`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (invoice.subscription) {
      const dbSubscription = await db.subscription.findFirst({
        where: { subscriptionId: invoice.subscription as string },
      });

      if (dbSubscription) {
        // Log successful payment
        await db.webhookLog.create({
          data: {
            provider: 'stripe',
            eventType: 'invoice.payment_succeeded',
            payload: JSON.stringify(invoice),
            processed: true,
            userId: dbSubscription.userId,
          },
        });

        console.log(`Successfully processed invoice payment for user ${dbSubscription.userId}`);
      }
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if (invoice.subscription) {
      const dbSubscription = await db.subscription.findFirst({
        where: { subscriptionId: invoice.subscription as string },
      });

      if (dbSubscription) {
        // Log failed payment
        await db.webhookLog.create({
          data: {
            provider: 'stripe',
            eventType: 'invoice.payment_failed',
            payload: JSON.stringify(invoice),
            processed: true,
            userId: dbSubscription.userId,
          },
        });

        console.log(`Processed failed invoice payment for user ${dbSubscription.userId}`);
      }
    }
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}