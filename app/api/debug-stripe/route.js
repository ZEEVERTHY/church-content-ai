import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_SECRET_KEY_LENGTH: process.env.STRIPE_SECRET_KEY?.length || 0,
      STRIPE_SECRET_KEY_ENDS_WITH: process.env.STRIPE_SECRET_KEY?.slice(-4) || 'N/A',
      STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
      STRIPE_PRICE_ID_VALUE: process.env.STRIPE_PRICE_ID || 'N/A',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'N/A',
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: 'Environment variables check complete'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
