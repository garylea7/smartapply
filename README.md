# 🚀 SmartApply - ATS Resume Checker SaaS

A production-ready SaaS platform that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Upload your resume, paste a job description, and get instant AI-powered analysis with actionable insights.

## ✨ Features

### 🎯 Core Functionality
- **ATS Resume Analysis**: Comprehensive 0-100 scoring system
- **Keyword Optimization**: Identify missing keywords and skills
- **AI-Powered Insights**: GPT-4 powered analysis with actionable recommendations
- **PDF Upload Support**: Easy resume upload with drag-and-drop interface
- **Instant Results**: Real-time analysis with detailed breakdowns

### 💰 Pricing Tiers
- **Free**: 1 analysis per day, basic scoring, top 10 keywords
- **Pro ($15/month)**: 20 analyses/month, full keyword map, tailored resume, cover letter, export options
- **Pro+ ($39/month)**: Unlimited analyses, multiple profiles, interview Q&A, job scraping
- **Lifetime ($299)**: All Pro+ features, one-time payment, priority support

### 🔐 Authentication & Security
- **Magic Link Authentication**: Passwordless sign-in with email links
- **Secure Sessions**: JWT-based authentication with HTTP-only cookies
- **Usage Limits**: Enforced per-plan usage metering
- **Data Privacy**: Secure resume processing with temporary storage

### 💳 Payment Integration
- **Stripe Checkout**: Seamless payment processing
- **Subscription Management**: Customer portal for plan management
- **Webhook Handling**: Real-time subscription updates
- **Multiple Plans**: Monthly subscriptions and lifetime options

### 📧 Email & CRM
- **GetResponse Integration**: Automated email list management
- **Email Sequences**: Welcome emails, upgrade nudges, weekly digests
- **Webhook Support**: Real-time contact synchronization
- **Tag-based Automation**: Smart email segmentation

### 📊 Analytics & Tracking
- **Usage Analytics**: Detailed usage statistics and limits
- **Performance Tracking**: ATS score improvement over time
- **Webhook Logging**: Complete audit trail of all events
- **User Management**: Comprehensive account management

## 🚀 Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first styling
- **🧩 shadcn/ui** - High-quality accessible components

### 🗄️ Backend & Database
- **🗄️ Prisma** - Modern ORM with SQLite
- **🔐 JWT Authentication** - Secure token-based auth
- **📧 Nodemailer** - Email delivery service
- **🤖 ZAI SDK** - AI-powered analysis

### 💳 Payment & Integration
- **💳 Stripe** - Payment processing
- **📧 GetResponse** - Email marketing automation
- **🌐 Axios** - HTTP client
- **📋 FormData** - File upload handling

### 🎨 UI/UX Features
- **🎯 Lucide React** - Beautiful icons
- **🌈 Framer Motion** - Smooth animations
- **📱 Responsive Design** - Mobile-first approach
- **🌙 Dark Mode** - Theme switching support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Stripe account
- GetResponse account (optional)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd smartapply

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up your environment variables
# Edit .env file with your actual values

# Initialize database
npm run db:push
npm run db:generate

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application
APP_URL="http://localhost:3000"
NODE_ENV="development"
BRAND_NAME="SmartApply"

# Email/SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@smartapply.ai"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PRICE_PRO_MONTHLY="price_your_pro_monthly_price_id"
STRIPE_PRICE_PRO_PLUS_MONTHLY="price_your_pro_plus_monthly_price_id"
STRIPE_PRICE_LIFETIME="price_your_lifetime_price_id"

# GetResponse
GETRESPONSE_API_KEY="your_getresponse_api_key"
GETRESPONSE_CAMPAIGN_ID="your_campaign_id"

# AI/LLM
OPENAI_API_KEY="your_openai_api_key"
```

### Stripe Setup

1. **Create Stripe Products and Prices:**
   - Pro Monthly: $15/month
   - Pro+ Monthly: $39/month  
   - Lifetime: $299 one-time

2. **Configure Webhooks:**
   - Add webhook endpoint: `your-domain.com/api/webhooks/stripe`
   - Listen for events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

3. **Update Environment Variables:**
   - Add your Stripe secret key
   - Add price IDs from Stripe dashboard
   - Add webhook signing secret

### GetResponse Setup (Optional)

1. **Create Campaign:**
   - Set up a campaign for new users
   - Configure welcome email sequence

2. **Get API Key:**
   - Enable API access in GetResponse settings
   - Generate API key

3. **Configure Webhooks:**
   - Set up webhook URL: `your-domain.com/api/webhooks/getresponse`
   - Enable contact creation events

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── analyze/       # Resume analysis
│   │   ├── checkout/      # Stripe checkout
│   │   ├── subscription/  # Subscription management
│   │   ├── webhooks/      # Webhook handlers
│   │   └── optin/         # Email opt-in
│   ├── auth/              # Authentication pages
│   ├── app/               # Protected app pages
│   ├── pricing/           # Pricing page
│   └── ats-resume-checker/ # SEO landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── AnalysisForm.tsx  # Resume upload form
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database client
│   ├── email.ts          # Email service
│   ├── getresponse.ts    # GetResponse integration
│   └── utils.ts          # Helper functions
└── middleware.ts         # Route protection
```

## 🎯 Key Features Implementation

### Authentication Flow
1. User enters email on landing page
2. Magic link sent via email
3. User clicks link to verify email
4. JWT token issued via HTTP-only cookie
5. Protected routes validate token via middleware

### Resume Analysis Process
1. User uploads PDF resume
2. System parses PDF text content
3. User pastes job description
4. AI analyzes resume vs job description
5. Returns ATS score, missing keywords, improvements
6. Results stored in database with usage tracking

### Payment Integration
1. User selects plan on pricing page
2. Stripe Checkout session created
3. User completes payment
4. Webhook confirms payment
5. User plan upgraded in database
6. Access to premium features granted

### Usage Limits
- **Free**: 1 analysis per day (resets at midnight UTC)
- **Pro**: 20 analyses per month (resets on 1st of month)
- **Pro+/Lifetime**: Unlimited (fair use policy applies)

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Setup for Production

1. **Set Production Variables:**
   ```env
   NODE_ENV="production"
   APP_URL="https://your-domain.com"
   DATABASE_URL="production-database-url"
   ```

2. **Configure Domain:**
   - Set up DNS records
   - Configure SSL certificates
   - Set up webhook URLs

3. **Database Migration:**
   ```bash
   npm run db:migrate
   ```

### Webhook Configuration

Update webhook URLs in:
- **Stripe Dashboard**: `https://your-domain.com/api/webhooks/stripe`
- **GetResponse**: `https://your-domain.com/api/webhooks/getresponse`

## 📊 Analytics & Monitoring

### Key Metrics to Track
- User acquisition and conversion rates
- Analysis completion rates
- Upgrade conversion rates
- Churn and retention metrics
- ATS score improvements

### Webhook Logging
All webhook events are logged in the database for:
- Debugging integration issues
- Auditing subscription changes
- Tracking email list synchronization
- Monitoring payment failures

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

---

Built with ❤️ for job seekers worldwide. Powered by modern web technologies and AI. 🚀
