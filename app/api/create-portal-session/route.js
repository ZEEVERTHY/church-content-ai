import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    console.log('🔍 Creating portal session...')
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
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

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' }, 
        { status: 400 }
      )
    }

    console.log('🔍 Getting customer ID for user:', userId)

    // Get the customer ID from our database
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      console.log('❌ No active subscription found:', subError)
      return NextResponse.json(
        { error: 'No active subscription found' }, 
        { status: 404 }
      )
    }

    console.log('💳 Creating Stripe portal session for customer:', subscription.stripe_customer_id)

    // Create Stripe portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    console.log('✅ Portal session created:', portalSession.id)

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('❌ Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session', details: error.message }, 
      { status: 500 }
    )
  }
}
