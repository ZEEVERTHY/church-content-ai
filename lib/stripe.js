import Stripe from 'stripe'
import { serverLog, serverError } from './logger'

// Validate Stripe configuration
if (!process.env.STRIPE_SECRET_KEY && typeof window === 'undefined') {
  serverError('⚠️  STRIPE_SECRET_KEY is not set! Payment functionality will not work.')
}

// Initialize Stripe with your secret key
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null

// Stripe configuration
export const STRIPE_CONFIG = {
  // 5,000 Naira in kobo (Stripe uses smallest currency unit)
  MONTHLY_PRICE_NAIRA: 500000, // 5,000 Naira = 500,000 kobo
  CURRENCY: 'ngn', // Nigerian Naira
  PRICE_ID: process.env.STRIPE_PRICE_ID, // You'll set this in your Stripe dashboard
}

if (!STRIPE_CONFIG.PRICE_ID && typeof window === 'undefined') {
  serverError('⚠️  STRIPE_PRICE_ID is not set! Checkout will not work.')
}

// Helper function to format price for display
export const formatPrice = (amountInKobo) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amountInKobo / 100)
}
