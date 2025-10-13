'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_CONFIG, formatPrice } from '../../lib/stripe'

export default function PricingPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        await checkSubscriptionStatus(session.user.id)
      } else {
        router.push('/auth')
      }
    }
    getUser()
  }, [router])

  const checkSubscriptionStatus = async (userId) => {
    try {
      // For now, skip subscription check to avoid 406 error
      // TODO: Implement this after database schema is set up
      console.log('🔍 Skipping subscription check for now')
      setSubscription(null)
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  const handleUpgrade = async () => {
    if (!user) return

    setLoading(true)
    try {
      const session = await supabase.auth.getSession()
      console.log('🔍 User session:', session.data.session)
      console.log('🔍 User data:', user)
      console.log('🔍 STRIPE_CONFIG.PRICE_ID:', STRIPE_CONFIG.PRICE_ID)
      
      const requestData = {
        priceId: 'price_1SGPB4POknuH8nO4cVGArikB', // Your actual price ID
        userId: user.id,
        userEmail: user.email
      }
      
      // Debug: Check if PRICE_ID is defined
      console.log('🔍 STRIPE_CONFIG:', STRIPE_CONFIG)
      console.log('🔍 STRIPE_CONFIG.PRICE_ID:', STRIPE_CONFIG.PRICE_ID)
      console.log('🔍 typeof STRIPE_CONFIG.PRICE_ID:', typeof STRIPE_CONFIG.PRICE_ID)
      console.log('🔍 Sending request data:', requestData)
      console.log('🔍 User object:', user)
      console.log('🔍 User ID:', user?.id)
      console.log('🔍 User Email:', user?.email)
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`
        },
        body: JSON.stringify(requestData)
      })

      console.log('🔍 Response status:', response.status)
      console.log('🔍 Response ok:', response.ok)
      
      const responseData = await response.json()
      console.log('🔍 Response data:', responseData)
      
      if (response.ok && responseData.sessionId) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        await stripe.redirectToCheckout({ sessionId: responseData.sessionId })
      } else {
        console.error('❌ API Error:', responseData)
        alert(`Error: ${responseData.error || 'Failed to create checkout session'}`)
      }
    } catch (error) {
      console.error('❌ Network Error:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`
        },
        body: JSON.stringify({
          userId: user.id
        })
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
      alert('Error accessing subscription management. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">ChurchContentAI</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm sm:text-base">← Dashboard</a>
              <span className="text-gray-700 text-xs sm:text-sm hidden sm:block">{user.user_metadata?.full_name || user.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Upgrade Your Account</h2>
          <p className="text-lg sm:text-xl text-gray-600 px-4">Unlock unlimited content creation for your ministry</p>
        </div>

        {/* Current Status */}
        {subscription ? (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-green-800">Premium Active</h3>
                <p className="text-sm sm:text-base text-green-700">You have unlimited access to all features</p>
                <p className="text-xs sm:text-sm text-green-600 mt-1">
                  Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleManageSubscription}
                className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm sm:text-base"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800">Free Account</h3>
                <p className="text-sm sm:text-base text-blue-700">You&apos;re currently on the free plan with limited creations</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Card */}
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-200 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-xs sm:text-sm font-medium transform rotate-45 translate-x-4 translate-y-3 sm:translate-x-6 sm:translate-y-4">
              POPULAR
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
                <p className="text-sm sm:text-base text-gray-600">Perfect for active church leaders</p>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-600">
                    ₦{STRIPE_CONFIG.MONTHLY_PRICE_NAIRA / 100}
                  </span>
                  <span className="text-lg sm:text-xl text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Billed monthly, cancel anytime</p>
              </div>

              {/* Features */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm sm:text-base text-gray-700">Unlimited sermon generation</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm sm:text-base text-gray-700">Unlimited Bible study outlines</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm sm:text-base text-gray-700">Save unlimited content to library</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm sm:text-base text-gray-700">Priority support</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm sm:text-base text-gray-700">Advanced AI features</span>
                </div>
              </div>

              {/* CTA Button */}
              {subscription ? (
                <button
                  onClick={handleManageSubscription}
                  className="w-full bg-gray-600 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-lg hover:bg-gray-700 transition duration-200 font-medium text-base sm:text-lg"
                >
                  Manage Subscription
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium text-base sm:text-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                      <span className="text-sm sm:text-base">Processing...</span>
                    </>
                  ) : (
                    'Upgrade to Premium'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
            <p className="text-sm sm:text-base text-gray-600">Generate professional content in minutes instead of hours</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Focus on Ministry</h3>
            <p className="text-sm sm:text-base text-gray-600">Spend more time with your congregation, less time preparing</p>
          </div>
          
          <div className="text-center sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Better Content</h3>
            <p className="text-sm sm:text-base text-gray-600">AI-powered insights help create more engaging messages</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16 px-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">Frequently Asked Questions</h3>
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Can I cancel anytime?</h4>
              <p className="text-gray-600 text-sm sm:text-base">Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm sm:text-base">We accept all major credit cards, debit cards, and bank transfers through our secure Stripe payment system.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Is my data secure?</h4>
              <p className="text-gray-600 text-sm sm:text-base">Absolutely. We use industry-standard encryption and security measures to protect your content and personal information.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
