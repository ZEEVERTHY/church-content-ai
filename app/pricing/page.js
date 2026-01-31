'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_CONFIG } from '../../lib/stripe'
import Navigation from '../../components/layout/Navigation'

export default function Pricing() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setUser(session.user)
        }
      } catch (error) {
        console.error('Auth error:', error)
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    setLoading(true)
    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          priceId: 'price_1SGPB4POknuH8nO4cVGArikB', // Hardcoded for testing
          userId: user.id,
          userEmail: user.email
        }),
        cache: 'no-store', // Prevent Next.js from caching API calls
        next: { revalidate: 0 } // Force revalidation on every request
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      })

      if (error) {
        console.error('Stripe error:', error)
        alert('Failed to redirect to checkout. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout process. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation user={user} onSignOut={handleSignOut} loading={loading} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Choose Your Plan</h2>
          <p className="text-muted-foreground mt-4">Unlock unlimited content generation for your ministry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-background border border-border rounded-lg shadow p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-foreground mb-4">₦0</div>
              <p className="text-muted-foreground mb-8">Perfect for getting started</p>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center text-foreground">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3 sermon generations per month
                </li>
                <li className="flex items-center text-foreground">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3 Bible study generations per month
                </li>
                <li className="flex items-center text-foreground">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic AI assistance
                </li>
              </ul>
              
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Current Plan</p>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-background border-2 border-primary rounded-lg shadow-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-primary mb-4">₦5,000</div>
              <p className="text-muted-foreground mb-8">per month</p>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center text-foreground">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited sermon generations
                </li>
                <li className="flex items-center text-foreground">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited Bible study generations
                </li>
                <li className="flex items-center text-foreground">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced AI assistance
                </li>
                <li className="flex items-center text-foreground">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                  loading
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Upgrade to Premium'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">How does billing work?</h4>
              <p className="text-muted-foreground">You&apos;ll be charged ₦5,000 monthly. You can cancel anytime from your dashboard.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">What payment methods do you accept?</h4>
              <p className="text-muted-foreground">We accept all major credit cards, debit cards, and bank transfers through Stripe.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Can I change plans later?</h4>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time from your dashboard.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Is there a free trial?</h4>
              <p className="text-muted-foreground">Yes! Start with our free plan that includes 3 generations per month.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}