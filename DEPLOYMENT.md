# SmartApply ATS Resume Checker - Deployment Guide

This guide will walk you through deploying your SmartApply ATS Resume Checker to Vercel with GitHub integration.

## Prerequisites

Before you begin, make sure you have:

1. A [GitHub](https://github.com) account
2. A [Vercel](https://vercel.com) account (free tier is fine)
3. A [Stripe](https://stripe.com) account for payments (optional)
4. A [GetResponse](https://getresponse.com) account for email marketing (optional)
5. An email account for sending magic links (Gmail recommended)

## Step 1: Push to GitHub

First, create a new GitHub repository and push your code:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/smartapply.git

# Push to GitHub
git push -u origin main
```

## Step 2: Connect to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" > "Project"
3. Find and select your GitHub repository
4. Keep the default framework preset (Next.js)
5. Expand "Environment Variables" and add the following:

```
# Required variables
DATABASE_URL=postgresql://postgres:password@localhost:5432/smartapply
JWT_SECRET=your-secure-jwt-secret-key-at-least-32-chars
APP_URL=https://your-vercel-app-url.vercel.app
BRAND_NAME=SmartApply

# For email magic links (required for authentication)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# For AI analysis (using z.ai/GLM-4.5 by default)
AI_PROVIDER=zai

# Optional: For Stripe payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Optional: For GetResponse email marketing
GETRESPONSE_API_KEY=your_getresponse_api_key
GETRESPONSE_CAMPAIGN_ID=your_campaign_id
```

6. Click "Deploy"

## Step 3: Set Up Database

Vercel doesn't provide a built-in database, so you'll need to use an external PostgreSQL provider:

1. Create a PostgreSQL database on [Supabase](https://supabase.com) (free tier available) or [Railway](https://railway.app)
2. Get your PostgreSQL connection string
3. Update the `DATABASE_URL` environment variable in Vercel project settings
4. Run the database migrations by connecting to Vercel CLI:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link to your project
   vercel link
   
   # Run database migrations
   vercel env pull .env.local
   npx prisma db push
   ```

## Step 4: Configure Stripe (Optional)

If you're using Stripe for payments:

1. Create products in your Stripe dashboard:
   - Free tier (price: $0)
   - Pro tier (price: $15/month)
   - Pro+ tier (price: $39/month)
   - Lifetime tier (price: $299 one-time)

2. Set up a webhook in Stripe dashboard:
   - Endpoint URL: `https://your-vercel-app-url.vercel.app/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`

3. Get your webhook signing secret and update the `STRIPE_WEBHOOK_SECRET` in Vercel

## Step 5: Configure GetResponse (Optional)

If you're using GetResponse for email marketing:

1. Create a campaign in GetResponse
2. Get your API key and campaign ID
3. Update the environment variables in Vercel

## Step 6: Configure Email for Magic Links

For Gmail:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account > Security > App Passwords
3. Use this password as your `SMTP_PASS` environment variable

## Step 7: Test Your Deployment

1. Visit your Vercel deployment URL
2. Test the authentication flow (signup with email)
3. Test the resume analysis feature
4. Test the payment flow (if configured)

## Troubleshooting

- **Database Issues**: Check your connection string and make sure your IP is allowed
- **Email Not Sending**: Verify SMTP credentials and check spam folder
- **Payment Issues**: Check Stripe webhook logs and ensure keys are correct
- **Analysis Not Working**: Verify AI provider settings

## Next Steps

- Set up a custom domain in Vercel
- Configure analytics (Google Analytics, Plausible, etc.)
- Set up monitoring and error tracking (Sentry, LogRocket, etc.)
- Implement A/B testing for landing page optimization

## Support

If you encounter any issues, check the application logs in Vercel dashboard or contact support.
