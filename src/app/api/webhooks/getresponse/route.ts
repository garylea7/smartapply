import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateMagicToken, generateAccessToken, generateUserId } from '@/lib/auth';
import { sendEmail, generateMagicLinkEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Verify GetResponse webhook signature if needed
    // const signature = headers().get('x-getresponse-signature');
    
    console.log('GetResponse webhook received:', payload);

    const { event, contact } = payload;

    // Handle contact creation event
    if (event === 'contact_created' && contact?.email) {
      const email = contact.email;
      const name = contact.name || '';
      const tags = contact.tags || [];

      // Find or create user
      let user = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await db.user.create({
          data: {
            id: generateUserId(),
            email,
            name,
            plan: 'FREE',
          },
        });
      }

      // Send magic link if user is new or tags indicate they should get access
      if (!user.emailVerified || tags.includes('grant_access')) {
        const magicToken = generateMagicToken(email);
        const magicLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify?token=${magicToken}`;

        const emailHtml = generateMagicLinkEmail(email, magicLink);
        await sendEmail({
          to: email,
          subject: 'Welcome to SmartApply - Your Magic Link',
          html: emailHtml,
        });

        // Update user verification status
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: true },
        });
      }

      // Log webhook
      await db.webhookLog.create({
        data: {
          provider: 'getresponse',
          eventType: event,
          payload: JSON.stringify(payload),
          processed: true,
          userId: user.id,
        },
      });

      console.log(`Processed GetResponse contact creation for ${email}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('GetResponse webhook error:', error);
    
    // Log error
    await db.webhookLog.create({
      data: {
        provider: 'getresponse',
        eventType: 'error',
        payload: JSON.stringify({ error: error.message }),
        processed: false,
      },
    });

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}