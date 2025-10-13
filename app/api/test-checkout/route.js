import { NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG } from '../../../lib/stripe'

export async function POST(request) {
  try {
    console.log('🔍 Testing checkout session creation...')
    
    const { priceId } = await request.json()
    
    console.log('🔍 Price ID from request:', priceId)
    console.log('🔍 STRIPE_CONFIG.PRICE_ID:', STRIPE_CONFIG.PRICE_ID)
    console.log('🔍 Environment STRIPE_PRICE_ID:', process.env.STRIPE_PRICE_ID)
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }
    
    // Test creating a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      customer_email: 'test@example.com',
    })
    
    console.log('✅ Test checkout session created:', session.id)
    
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      message: 'Test checkout session created successfully'
    })
  } catch (error) {
    console.error('❌ Test checkout error:', error)
    return NextResponse.json(
      { error: 'Test checkout failed', details: error.message },
      { status: 500 }
    )
  }
}
