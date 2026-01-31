# ChurchContentAI - Project Overview

## 🎯 Project Description

**ChurchContentAI** is a Next.js web application designed to help pastors and ministry leaders create AI-assisted sermons and Bible studies. The platform emphasizes that AI is a tool to support ministry, not replace pastoral wisdom.

## 🏗️ Technology Stack

- **Framework**: Next.js 15.5.0 (App Router)
- **React**: 19.1.0
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Email**: EmailJS (for feedback)
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
churchcontentai/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── create-checkout-session/
│   │   ├── create-portal-session/
│   │   ├── generate-outline/
│   │   ├── generate-sermon/
│   │   ├── save-content/
│   │   ├── send-feedback/
│   │   └── webhook/       # Stripe webhook handler
│   ├── about/
│   ├── auth/              # Authentication page
│   ├── dashboard/         # User dashboard
│   ├── feedback/          # Feedback form
│   ├── generate-sermon/   # Sermon generation
│   ├── generate-study/    # Bible study generation
│   ├── pricing/           # Pricing page
│   ├── support/           # Support page
│   └── testimonials/
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
│   ├── openai.js        # OpenAI integration
│   ├── stripe.js         # Stripe integration
│   ├── supabase.js      # Supabase client
│   ├── emailService.js  # Email service
│   └── usageContext.js  # Usage tracking
├── public/              # Static assets
├── database-schema.sql  # Database schema
└── package.json
```

## 🔑 Required Environment Variables

### Core Application
```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Production: https://yourdomain.com
NODE_ENV=development  # or 'production'
```

### Supabase (Authentication & Database)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### OpenAI (AI Content Generation)
```env
OPENAI_API_KEY=sk-...
```

### Stripe (Payments)
```env
STRIPE_SECRET_KEY=sk_test_...  # Use sk_live_... for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Use pk_live_... for production
STRIPE_PRICE_ID=price_...  # Your Stripe price ID
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret
```

### Email (Feedback System - Optional)
```env
# Option 1: EmailJS
EMAIL_SERVICE_ID=service_xxxxxxx
EMAIL_TEMPLATE_ID=template_xxxxxxx
EMAIL_PUBLIC_KEY=user_xxxxxxxxxxxxx
FEEDBACK_EMAIL=your-email@example.com

# Option 2: Gmail (Alternative)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
FEEDBACK_EMAIL=your-email@gmail.com
```

## 🚀 How to Start the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory with all required environment variables (see above).

### 3. Set Up Supabase
1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key
3. Run the SQL commands from `database-schema.sql` in the Supabase SQL editor
4. Configure authentication providers (Email, Google, etc.) in Supabase dashboard

### 4. Set Up Stripe
1. Create a Stripe account at https://stripe.com
2. Get your API keys (test mode for development)
3. Create a product with price: ₦5,000/month (NGN)
4. Set up webhook endpoint (see STRIPE_SETUP.md)
5. Configure customer portal

### 5. Set Up OpenAI
1. Get an API key from https://platform.openai.com
2. Add it to your `.env.local` file

### 6. Run Development Server
```bash
npm run dev
```

The app will be available at http://localhost:3000

### 7. Build for Production
```bash
npm run build
npm start
```

## 📋 Main Features

### 1. **Authentication**
- Email/password authentication via Supabase
- Social login (Google, etc.) - configurable
- Protected routes
- User session management

### 2. **AI Content Generation**
- **Sermon Generation**: Create full sermons with:
  - Topic and scripture input
  - Style selection (conversational, encouraging, practical, etc.)
  - Length options (short, medium, long)
  - Pastoral tone and theological accuracy
  
- **Bible Study Generation**: Create structured study guides with:
  - Opening discussions
  - Scripture exploration
  - Discussion questions
  - Practical application
  - Reflection prompts

### 3. **Subscription System**
- Free tier: 3 generations per month
- Premium tier: ₦5,000/month (unlimited)
- Stripe integration for payments
- Subscription management via Stripe Customer Portal
- Usage tracking

### 4. **User Dashboard**
- View usage statistics
- Access generated content
- Subscription status
- Quick actions for content generation

### 5. **Additional Pages**
- About page
- Pricing page
- Testimonials
- Support/Help
- Feedback form
- Privacy Policy
- Terms of Service

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- API route authentication
- Environment variable protection
- Secure webhook handling (Stripe)
- XSS protection headers
- CSRF protection

## 📱 Mobile Responsive

- Fully responsive design
- Mobile-optimized navigation
- Touch-friendly UI
- PWA support (service worker, manifest)

## 🎨 UI/UX Features

- Modern, clean design
- Loading states and skeletons
- Error handling
- Onboarding modal for new users
- Data saver mode
- Performance monitoring (dev mode)

## 📊 Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:
- `user_subscriptions` - Tracks user subscription status
- `auth.users` - Supabase auth users (managed by Supabase)

See `database-schema.sql` for full schema.

## 🔄 API Routes

- `/api/create-checkout-session` - Create Stripe checkout
- `/api/create-portal-session` - Access Stripe customer portal
- `/api/generate-sermon` - Generate sermon content
- `/api/generate-outline` - Generate Bible study outline
- `/api/save-content` - Save user content
- `/api/send-feedback` - Send feedback emails
- `/api/webhook` - Handle Stripe webhooks

## 🚢 Deployment Checklist

### Before Going Live:

1. **Environment Variables**
   - [ ] All environment variables set in production (Vercel/dashboard)
   - [ ] Use production API keys (Stripe live keys, OpenAI, etc.)
   - [ ] Set `NEXT_PUBLIC_APP_URL` to production domain

2. **Supabase**
   - [ ] Database schema deployed
   - [ ] RLS policies active
   - [ ] Authentication providers configured
   - [ ] Production database URL and keys

3. **Stripe**
   - [ ] Switch to live mode
   - [ ] Update webhook endpoint to production URL
   - [ ] Test payment flow
   - [ ] Customer portal configured

4. **OpenAI**
   - [ ] API key with sufficient credits
   - [ ] Rate limiting considered

5. **Email**
   - [ ] Email service configured (EmailJS or alternative)
   - [ ] Test feedback form

6. **Testing**
   - [ ] Test authentication flow
   - [ ] Test content generation
   - [ ] Test payment/subscription flow
   - [ ] Test on mobile devices
   - [ ] Test error handling

7. **SEO & Metadata**
   - [ ] Update metadata in `app/layout.js`
   - [ ] Add Open Graph images
   - [ ] Verify canonical URLs

8. **Performance**
   - [ ] Run `npm run build` successfully
   - [ ] Check bundle size
   - [ ] Test loading times

9. **Security**
   - [ ] Review security headers
   - [ ] Verify environment variables are not exposed
   - [ ] Test authentication protection

10. **Legal**
    - [ ] Privacy Policy content reviewed
    - [ ] Terms of Service reviewed
    - [ ] GDPR compliance (if applicable)

## 📝 Additional Setup Guides

- **Stripe Setup**: See `STRIPE_SETUP.md`
- **Email Setup**: See `EMAIL_SETUP.md`
- **Database Setup**: See `database-schema.sql`

## 🐛 Troubleshooting

### Common Issues:

1. **"Stripe configuration error"**
   - Check that `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` are set
   - Verify keys are for the correct mode (test/live)

2. **"OpenAI API error"**
   - Verify `OPENAI_API_KEY` is set correctly
   - Check API key has credits
   - Verify model access (GPT-4)

3. **"Supabase connection error"**
   - Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Verify Supabase project is active

4. **"Webhook not working"**
   - Verify webhook URL is accessible
   - Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
   - Test webhook in Stripe dashboard

## 📞 Support

For issues or questions:
- Check the `/support` page in the app
- Use the `/feedback` page to submit feedback
- Review error logs in Vercel dashboard

---

**Built with ❤️ for pastors worldwide**

