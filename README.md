# ChurchContentAI

AI-powered content creation tool for pastors and ministry leaders. Generate sermons and Bible studies with AI assistance while maintaining your unique pastoral voice.

## 🚀 Quick Start

See **[QUICK_START.md](./QUICK_START.md)** for a step-by-step setup guide.

### Prerequisites

- Node.js 18+
- Accounts for: Supabase, OpenAI, Stripe

### Installation

```bash
# Install dependencies
npm install

# Create environment file
# Copy the template below and create .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Required Environment Variables

Create a `.env.local` file with:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
OPENAI_API_KEY=sk-your-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Optional)
FEEDBACK_EMAIL=your-email@example.com
EMAIL_SERVICE_ID=service_...
EMAIL_TEMPLATE_ID=template_...
EMAIL_PUBLIC_KEY=user_...
```

## 📚 Documentation

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Complete project documentation
- **[QUICK_START.md](./QUICK_START.md)** - Step-by-step setup guide
- **[PRE_LAUNCH_CHECKLIST.md](./PRE_LAUNCH_CHECKLIST.md)** - Pre-launch checklist
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Stripe payment setup
- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Email service setup

## 🏗️ Tech Stack

- **Framework**: Next.js 15.5 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Styling**: Tailwind CSS

## ✨ Features

- 🤖 AI-powered sermon generation
- 📖 Bible study outline creation
- 💳 Subscription management (Free & Premium)
- 👤 User authentication
- 📊 Usage tracking
- 📱 Mobile responsive
- 🔒 Secure & GDPR compliant

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See **[PRE_LAUNCH_CHECKLIST.md](./PRE_LAUNCH_CHECKLIST.md)** for production deployment steps.

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🆘 Support

- Check the `/support` page in the app
- Review setup guides in the `/docs` folder
- Check troubleshooting sections in documentation

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ for pastors worldwide**
