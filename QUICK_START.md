# 🚀 Quick Start Guide

Get your ChurchContentAI application running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Accounts for:
  - Supabase (free tier available)
  - OpenAI (requires API key)
  - Stripe (for payments)

## Step 1: Clone & Install

```bash
# Navigate to project directory
cd churchcontentai

# Install dependencies
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy this template and fill in your values
cp .env.example .env.local  # If .env.example exists
# OR create .env.local manually
```

### Required Variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-key-here

# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your-key-here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
STRIPE_PRICE_ID=price_your-price-id
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email (Optional - for feedback form)
FEEDBACK_EMAIL=your-email@example.com
EMAIL_SERVICE_ID=service_xxxxxxx
EMAIL_TEMPLATE_ID=template_xxxxxxx
EMAIL_PUBLIC_KEY=user_xxxxxxxxxxxxx
```

## Step 3: Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Go to **Settings > API**
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Go to **SQL Editor**
6. Copy and run the SQL from `database-schema.sql`
7. Go to **Authentication > Providers**
8. Enable Email provider (and Google if desired)

## Step 4: Set Up Stripe (Test Mode)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Get API keys from **Developers > API Keys**
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Create a product:
   - Go to **Products**
   - Click **Add product**
   - Name: "Premium Plan"
   - Price: 5000 NGN (Nigerian Naira)
   - Billing: Monthly
   - Copy Price ID → `STRIPE_PRICE_ID`
4. Set up webhook (for local testing, use Stripe CLI):
   ```bash
   # Install Stripe CLI: https://stripe.com/docs/stripe-cli
   stripe listen --forward-to localhost:3000/api/webhook
   # Copy the webhook signing secret → STRIPE_WEBHOOK_SECRET
   ```

## Step 5: Set Up OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys**
4. Create new secret key
5. Copy to `OPENAI_API_KEY`
6. Add billing information (required for API access)

## Step 6: Run the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Test the Application

1. **Sign Up**: Go to `/auth` and create an account
2. **Generate Content**: 
   - Go to `/generate-sermon` or `/generate-study`
   - Create a test sermon or study
3. **Test Payment** (optional):
   - Go to `/pricing`
   - Click "Upgrade to Premium"
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date, any CVC

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify Supabase project is active
- Check browser console for specific errors

### "OpenAI API Error"
- Verify `OPENAI_API_KEY` is correct
- Check you have credits in your OpenAI account
- Ensure you have access to GPT-4 model

### "Stripe Error"
- Verify all Stripe keys are from the same mode (test or live)
- Check `STRIPE_PRICE_ID` matches your product
- For webhooks, ensure Stripe CLI is running (local) or webhook URL is correct (production)

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

## 📚 Next Steps

- Read `PROJECT_OVERVIEW.md` for detailed information
- Check `PRE_LAUNCH_CHECKLIST.md` before going live
- Review `STRIPE_SETUP.md` for production Stripe setup
- Review `EMAIL_SETUP.md` for email configuration

## 🆘 Need Help?

- Check the `/support` page in the app
- Review error messages in browser console
- Check Vercel/Stripe/Supabase logs
- See troubleshooting sections in setup guides

---

**Happy coding! 🎉**

