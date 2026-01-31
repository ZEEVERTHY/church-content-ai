# 🚀 Pre-Launch Checklist

Use this checklist to ensure everything is ready before going live.

## ✅ Environment & Configuration

### Environment Variables
- [ ] All environment variables set in production platform (Vercel)
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain (e.g., `https://churchcontentai.com`)
- [ ] `NODE_ENV=production` in production
- [ ] All sensitive keys are production keys (not test keys)

### Supabase
- [ ] Production Supabase project created
- [ ] `NEXT_PUBLIC_SUPABASE_URL` points to production project
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is production key
- [ ] Database schema (`database-schema.sql`) executed in production
- [ ] Row Level Security (RLS) policies active
- [ ] Authentication providers configured (Email, Google, etc.)
- [ ] Email templates configured (if using Supabase email)

### OpenAI
- [ ] `OPENAI_API_KEY` is valid and has credits
- [ ] API key has access to GPT-4 model
- [ ] Rate limits understood and monitored
- [ ] Cost estimates calculated

### Stripe
- [ ] Stripe account activated
- [ ] Switched to **Live Mode** (not test mode)
- [ ] `STRIPE_SECRET_KEY` is live key (starts with `sk_live_`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is live key (starts with `pk_live_`)
- [ ] Product created in Stripe dashboard
- [ ] Price ID (`STRIPE_PRICE_ID`) is from live mode
- [ ] Webhook endpoint configured for production URL
- [ ] `STRIPE_WEBHOOK_SECRET` is from production webhook
- [ ] Customer portal configured
- [ ] Test payment with real card (small amount)

### Email Service
- [ ] Email service configured (EmailJS, Resend, or Gmail)
- [ ] All email environment variables set
- [ ] Test feedback form sends emails successfully
- [ ] Email inbox monitored

## 🧪 Testing

### Authentication
- [ ] User can sign up with email
- [ ] User can log in
- [ ] User can reset password
- [ ] Protected routes redirect to auth if not logged in
- [ ] User can sign out
- [ ] Session persists correctly

### Content Generation
- [ ] Sermon generation works
- [ ] Bible study generation works
- [ ] Free tier limits enforced (3 generations)
- [ ] Premium users can generate unlimited content
- [ ] Error handling works (API failures, rate limits)
- [ ] Content saves correctly

### Payments & Subscriptions
- [ ] User can view pricing page
- [ ] "Upgrade to Premium" button works
- [ ] Stripe checkout opens correctly
- [ ] Test payment succeeds
- [ ] User redirected to dashboard after payment
- [ ] Subscription status updates correctly
- [ ] Webhook receives and processes events
- [ ] Customer portal accessible
- [ ] User can cancel subscription
- [ ] User can update payment method

### User Experience
- [ ] Dashboard loads correctly
- [ ] Usage count displays correctly
- [ ] Subscription status shows correctly
- [ ] Navigation works on all pages
- [ ] Mobile responsive on all pages
- [ ] Loading states work
- [ ] Error messages are user-friendly
- [ ] Onboarding modal works for new users

### Pages & Content
- [ ] Home page loads
- [ ] About page accessible
- [ ] Pricing page shows correct pricing
- [ ] Testimonials page loads
- [ ] Support page accessible
- [ ] Feedback form works
- [ ] Privacy Policy page accessible
- [ ] Terms of Service page accessible

## 🔒 Security

- [ ] Environment variables not exposed in client-side code
- [ ] API routes require authentication where needed
- [ ] Stripe webhook signature verified
- [ ] SQL injection protection (using Supabase client)
- [ ] XSS protection (React escapes by default)
- [ ] HTTPS enabled (Vercel does this automatically)
- [ ] Security headers configured (see `next.config.mjs`)
- [ ] No sensitive data in logs

## 📱 Mobile & PWA

- [ ] App works on mobile browsers
- [ ] Touch interactions work correctly
- [ ] Mobile navigation works
- [ ] PWA manifest configured (`manifest.json`)
- [ ] Service worker registered
- [ ] App icons present (`icon-192x192.png`, `icon-512x512.png`)
- [ ] App can be installed on mobile

## 🎨 SEO & Metadata

- [ ] Meta title and description set in `app/layout.js`
- [ ] Open Graph images added (or placeholder)
- [ ] Canonical URLs set
- [ ] Robots.txt configured (if needed)
- [ ] Sitemap generated (if needed)
- [ ] Social sharing preview works

## ⚡ Performance

- [ ] `npm run build` completes successfully
- [ ] No build errors or warnings
- [ ] Bundle size reasonable
- [ ] Images optimized
- [ ] Loading times acceptable
- [ ] Lighthouse score > 80 (if possible)

## 📊 Monitoring & Analytics

- [ ] Error tracking set up (optional: Sentry, etc.)
- [ ] Analytics configured (optional: Google Analytics)
- [ ] Vercel logs accessible
- [ ] Stripe dashboard monitored
- [ ] Supabase dashboard accessible

## 📄 Legal & Compliance

- [ ] Privacy Policy content reviewed and accurate
- [ ] Terms of Service reviewed and accurate
- [ ] GDPR compliance (if applicable)
- [ ] Cookie consent (if needed)
- [ ] Data retention policy clear

## 🚀 Deployment

- [ ] Code pushed to Git repository
- [ ] Vercel project connected to repository
- [ ] Production branch configured (usually `main` or `master`)
- [ ] Automatic deployments enabled
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] DNS records configured correctly

## 🧹 Final Checks

- [ ] Remove any test/placeholder content
- [ ] Remove console.log statements (or keep only necessary ones)
- [ ] Remove debug pages or protect them
- [ ] Update README with production info
- [ ] Document any manual setup steps
- [ ] Backup database schema
- [ ] Document environment variables needed

## 📝 Post-Launch

- [ ] Monitor error logs for first 24 hours
- [ ] Test payment flow with real transaction
- [ ] Verify webhooks are receiving events
- [ ] Check email delivery
- [ ] Monitor OpenAI API usage
- [ ] Set up alerts for critical errors
- [ ] Prepare customer support process

## 🎯 Quick Start Commands

```bash
# Development
npm install
npm run dev

# Production Build
npm run build
npm start

# Linting
npm run lint
```

## 📞 Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support
- **OpenAI Support**: https://help.openai.com

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Last Updated**: [Date]

**Notes**:
- Add any specific notes or issues here
- Document any workarounds or special configurations

