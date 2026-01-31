import { NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'
import { serverLog, serverError } from '../../../lib/logger'
import { withSecurity } from '../../../lib/security/middleware'
import { checkoutSchema } from '../../../lib/security/inputValidation'

/**
 * Create Checkout Session API Handler
 * Secured with rate limiting, authentication, and input validation
 */
async function handleCheckout(request, { user, validatedData, rateLimitHeaders }) {
  try {
    serverLog('🔍 Creating checkout session...')
    
    // Check environment variables first
    if (!process.env.STRIPE_SECRET_KEY) {
      serverError('❌ STRIPE_SECRET_KEY not found')
      return NextResponse.json(
        { error: 'Payment service is not configured. Please contact support.' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }

    if (!process.env.STRIPE_PRICE_ID) {
      serverError('❌ STRIPE_PRICE_ID not found')
      return NextResponse.json(
        { error: 'Payment service is not configured. Please contact support.' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      serverError('❌ NEXT_PUBLIC_APP_URL not found')
      return NextResponse.json(
        { error: 'App configuration error. Please contact support.' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }
    
    // validatedData is already sanitized and validated
    const { priceId, userId, userEmail } = validatedData
    
    // Verify userId matches authenticated user (prevent user spoofing)
    if (userId !== user.id) {
      serverError('❌ User ID mismatch:', { provided: userId, authenticated: user.id })
      return NextResponse.json(
        { error: 'Invalid user ID' }, 
        { status: 403, headers: rateLimitHeaders }
      )
    }
    
    // Verify email matches user's email (prevent email spoofing)
    if (userEmail !== user.email) {
      serverError('❌ Email mismatch:', { provided: userEmail, authenticated: user.email })
      return NextResponse.json(
        { error: 'Invalid email address' }, 
        { status: 403, headers: rateLimitHeaders }
      )
    }

    // Validate that Stripe is initialized
    if (!stripe) {
      serverError('❌ Stripe not initialized')
      return NextResponse.json(
        { error: 'Payment service is not available. Please contact support.' }, 
        { status: 500 }
      )
    }

    serverLog('💳 Creating Stripe checkout session:', { userId, userEmail })

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

    serverLog('✅ Checkout session created:', session.id)

    const response = NextResponse.json({ sessionId: session.id })
    
    // Add rate limit headers
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    serverError('❌ Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' }, 
      { status: 500 }
    )
  }
}

// Export secured handler
export const POST = withSecurity(handleCheckout, {
  requireAuth: true,
  rateLimitType: 'checkout',
  validationSchema: checkoutSchema,
  allowedMethods: ['POST'],
})
