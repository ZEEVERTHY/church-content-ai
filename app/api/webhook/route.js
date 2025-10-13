import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'
import { headers } from 'next/headers'

export async function POST(request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('🔔 Received webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' }, 
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session) {
  console.log('✅ Checkout session completed:', session.id)
  
  const userId = session.metadata?.userId
  const userEmail = session.metadata?.userEmail
  
  if (!userId) {
    console.error('❌ No userId in session metadata')
    return
  }

  // Get the customer ID from the session
  const customerId = session.customer
  
  try {
    // Create or update subscription record
    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: session.subscription,
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('❌ Error saving subscription:', error)
    } else {
      console.log('✅ Subscription saved successfully')
    }
  } catch (error) {
    console.error('❌ Error handling checkout completion:', error)
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('✅ Subscription created:', subscription.id)
  
  const userId = subscription.metadata?.userId
  
  if (!userId) {
    console.error('❌ No userId in subscription metadata')
    return
  }

  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('❌ Error saving subscription:', error)
    } else {
      console.log('✅ Subscription created successfully')
    }
  } catch (error) {
    console.error('❌ Error handling subscription creation:', error)
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Subscription updated:', subscription.id)
  
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)
      .select()

    if (error) {
      console.error('❌ Error updating subscription:', error)
    } else {
      console.log('✅ Subscription updated successfully')
    }
  } catch (error) {
    console.error('❌ Error handling subscription update:', error)
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Subscription deleted:', subscription.id)
  
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)
      .select()

    if (error) {
      console.error('❌ Error updating subscription status:', error)
    } else {
      console.log('✅ Subscription status updated to canceled')
    }
  } catch (error) {
    console.error('❌ Error handling subscription deletion:', error)
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log('✅ Payment succeeded for invoice:', invoice.id)
  
  if (invoice.subscription) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription)
        .select()

      if (error) {
        console.error('❌ Error updating subscription after payment:', error)
      } else {
        console.log('✅ Subscription status updated after successful payment')
      }
    } catch (error) {
      console.error('❌ Error handling payment success:', error)
    }
  }
}

async function handlePaymentFailed(invoice) {
  console.log('❌ Payment failed for invoice:', invoice.id)
  
  if (invoice.subscription) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription)
        .select()

      if (error) {
        console.error('❌ Error updating subscription after payment failure:', error)
      } else {
        console.log('✅ Subscription status updated after payment failure')
      }
    } catch (error) {
      console.error('❌ Error handling payment failure:', error)
    }
  }
}
