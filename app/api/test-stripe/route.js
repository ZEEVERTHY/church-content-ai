import { NextResponse } from 'next/server'
import { STRIPE_CONFIG } from '../../../lib/stripe'

export async function GET() {
  try {
    console.log('🔍 Testing Stripe configuration...')
    
    const config = {
      priceId: STRIPE_CONFIG.PRICE_ID,
      priceIdFromEnv: process.env.STRIPE_PRICE_ID,
      secretKeyExists: !!process.env.STRIPE_SECRET_KEY,
      publishableKeyExists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    }
    
    console.log('🔍 Stripe config test:', config)
    
    return NextResponse.json({
      success: true,
      config: config,
      message: 'Stripe configuration test'
    })
  } catch (error) {
    console.error('❌ Stripe config test error:', error)
    return NextResponse.json(
      { error: 'Stripe config test failed', details: error.message },
      { status: 500 }
    )
  }
}
