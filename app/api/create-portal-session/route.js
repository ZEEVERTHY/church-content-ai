import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'
import { withSecurity } from '../../../lib/security/middleware'
import { serverLog, serverError } from '../../../lib/logger'
import { validateUUID } from '../../../lib/security/inputValidation'

/**
 * Create Portal Session API Handler
 * Secured with rate limiting and authentication
 */
async function handlePortal(request, { user, validatedData, rateLimitHeaders }) {
  try {
    serverLog('🔍 Creating portal session...')
    
    // validatedData contains sanitized userId
    const { userId } = validatedData
    
    // Verify userId matches authenticated user (prevent user spoofing)
    if (userId !== user.id) {
      serverError('❌ User ID mismatch:', { provided: userId, authenticated: user.id })
      return NextResponse.json(
        { error: 'Invalid user ID' }, 
        { status: 403, headers: rateLimitHeaders }
      )
    }

    serverLog('🔍 Getting customer ID for user:', userId)

    // Get the customer ID from our database
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      serverError('❌ No active subscription found:', subError)
      return NextResponse.json(
        { error: 'No active subscription found' }, 
        { status: 404, headers: rateLimitHeaders }
      )
    }

    // Validate Stripe is initialized
    if (!stripe) {
      serverError('❌ Stripe not initialized')
      return NextResponse.json(
        { error: 'Payment service is not available' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }

    serverLog('💳 Creating Stripe portal session for customer:', subscription.stripe_customer_id)

    // Create Stripe portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
    })

    serverLog('✅ Portal session created:', portalSession.id)

    const response = NextResponse.json({ url: portalSession.url })
    
    // Add rate limit headers
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    serverError('❌ Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' }, 
      { status: 500 }
    )
  }
}

// Portal session schema
const portalSchema = {
  userId: {
    type: 'string',
    required: true,
    validate: validateUUID,
  },
}

// Export secured handler
export const POST = withSecurity(handlePortal, {
  requireAuth: true,
  rateLimitType: 'checkout',
  validationSchema: portalSchema,
  allowedMethods: ['POST'],
})
