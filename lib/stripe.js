import Stripe from 'stripe'

// Initialize Stripe with your secret key
console.log('🔍 Stripe Secret Key exists:', !!process.env.STRIPE_SECRET_KEY)
console.log('🔍 Stripe Secret Key ends with:', process.env.STRIPE_SECRET_KEY?.slice(-4))

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Stripe configuration
export const STRIPE_CONFIG = {
  // 5,000 Naira in kobo (Stripe uses smallest currency unit)
  MONTHLY_PRICE_NAIRA: 500000, // 5,000 Naira = 500,000 kobo
  CURRENCY: 'ngn', // Nigerian Naira
  PRICE_ID: process.env.STRIPE_PRICE_ID, // You'll set this in your Stripe dashboard
}

console.log('🔍 STRIPE_CONFIG.PRICE_ID:', STRIPE_CONFIG.PRICE_ID)
console.log('🔍 STRIPE_PRICE_ID from env:', process.env.STRIPE_PRICE_ID)

// Helper function to format price for display
export const formatPrice = (amountInKobo) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amountInKobo / 100)
}
