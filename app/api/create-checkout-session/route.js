import { NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    console.log('🔍 Creating checkout session...')
    
    // Check environment variables first
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('❌ STRIPE_SECRET_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'Stripe configuration error: Secret key not found' }, 
        { status: 500 }
      )
    }

    if (!process.env.STRIPE_PRICE_ID) {
      console.log('❌ STRIPE_PRICE_ID not found in environment variables')
      return NextResponse.json(
        { error: 'Stripe configuration error: Price ID not found' }, 
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.log('❌ NEXT_PUBLIC_APP_URL not found in environment variables')
      return NextResponse.json(
        { error: 'App configuration error: App URL not found' }, 
        { status: 500 }
      )
    }
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    console.log('🔍 Auth header exists:', !!authHeader)
    console.log('🔍 Auth header starts with Bearer:', authHeader?.startsWith('Bearer '))
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth header')
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify the token with Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.log('❌ Invalid token or user not found:', userError)
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const requestBody = await request.json()
    console.log('🔍 Request body:', requestBody)
    
    const { priceId, userId, userEmail } = requestBody

    console.log('🔍 Price ID:', priceId)
    console.log('🔍 User ID:', userId)
    console.log('🔍 User Email:', userEmail)
    console.log('🔍 STRIPE_PRICE_ID from env:', process.env.STRIPE_PRICE_ID)

    if (!priceId || !userId || !userEmail) {
      console.log('❌ Missing required parameters:', { priceId: !!priceId, userId: !!userId, userEmail: !!userEmail })
      return NextResponse.json(
        { error: 'Missing required parameters', details: { priceId: !!priceId, userId: !!userId, userEmail: !!userEmail } }, 
        { status: 400 }
      )
    }

    console.log('💳 Creating Stripe checkout session for user:', userId)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        userEmail: userEmail,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          userEmail: userEmail,
        },
      },
    })

    console.log('✅ Checkout session created:', session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message }, 
      { status: 500 }
    )
  }
}
