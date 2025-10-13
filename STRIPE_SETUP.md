# Stripe Setup Instructions

## 1. Create Stripe Account and Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or sign in
3. Go to **Developers > API Keys**
4. Copy your **Publishable key** and **Secret key**
5. Add them to your `.env.local` file:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

## 2. Create a Product and Price

1. In Stripe Dashboard, go to **Products**
2. Click **Add product**
3. Fill in the details:
   - **Name**: Premium Plan
   - **Description**: Unlimited content creation for church leaders
4. Under **Pricing**, select:
   - **Price**: 5000 (Naira)
   - **Billing period**: Monthly
   - **Currency**: NGN (Nigerian Naira)
5. Click **Save product**
6. Copy the **Price ID** (starts with `price_`)
7. Add it to your `.env.local`:
   ```
   STRIPE_PRICE_ID=price_...
   ```

## 3. Set Up Webhooks

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set **Endpoint URL** to: `https://yourdomain.com/api/webhook`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 4. Set Up Customer Portal (Optional)

1. In Stripe Dashboard, go to **Settings > Billing > Customer portal**
2. Configure the portal settings:
   - Enable **Update payment methods**
   - Enable **Cancel subscriptions**
   - Enable **Update billing information**
3. Save the configuration

## 5. Database Setup

Run the SQL commands in `database-schema.sql` in your Supabase SQL editor to create the subscription tracking tables.

## 6. Test the Integration

1. Use Stripe's test card numbers:
   - **Success**: 4242 4242 4242 4242
   - **Decline**: NPM RUN
2. Use any future expiry date and any 3-digit CVC
3. Test the complete flow:
   - User clicks "Upgrade to Premium"
   - Completes checkout
   - Gets redirected back to dashboard
   - Should see "Premium Active" status

## 7. Go Live

When ready for production:
1. Switch to **Live mode** in Stripe Dashboard
2. Update your API keys to live keys
3. Update webhook endpoint to production URL
4. Test with real payment methods

## Troubleshooting

- **Webhook not receiving events**: Check that your webhook URL is accessible and the signing secret is correct
- **Payment not processing**: Verify your price ID and currency settings
- **Subscription not updating**: Check that webhook events are being received and processed correctly
