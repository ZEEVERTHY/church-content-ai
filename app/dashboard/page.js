'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { getCurrentUsageCount, hasActiveSubscription } from '../../lib/usageContext'
import Layout from '../../components/layout/Layout'
import { DashboardSkeleton } from '../../components/ui/SkeletonLoader'
import OnboardingModal from '../../components/ui/OnboardingModal'
import ContentAnalytics from '../../components/ui/ContentAnalytics'
import Image from 'next/image'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usageCount, setUsageCount] = useState(0)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userContent, setUserContent] = useState([])
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log('🔍 Dashboard: Checking authentication...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Auth session error:', error)
          router.push('/auth')
          return
        }
        
        if (session && session.user) {
          console.log('✅ User authenticated:', session.user.email)
          setUser(session.user)
          await loadUsageData(session.user.id)
        } else {
          console.log('❌ No active session, redirecting to auth')
          router.push('/auth')
        }
      } catch (error) {
        console.error('❌ Dashboard auth error:', error)
        router.push('/auth')
      }
    }
    getUser()
  }, [router, loadUsageData])

  const loadUsageData = useCallback(async (userId) => {
    try {
      console.log('🔍 Loading usage data for user:', userId)
      
      const count = await getCurrentUsageCount(supabase, userId)
      console.log('📊 Usage count:', count)
      setUsageCount(count)
      
      const hasSubscription = await hasActiveSubscription(supabase, userId)
      console.log('💳 Has subscription:', hasSubscription)
      setSubscriptionStatus(hasSubscription)

      // Load user content for analytics
      await loadUserContent(userId)

      // Check if user needs onboarding
      if (typeof window !== 'undefined') {
        const onboardingCompleted = localStorage.getItem('onboardingCompleted')
        if (!onboardingCompleted && count === 0) {
          setShowOnboarding(true)
        }
      }
    } catch (error) {
      console.error('❌ Error loading usage data:', error)
      // Don't redirect on usage data errors, just log them
    } finally {
      setLoading(false)
    }
  }, [])

  const loadUserContent = async (userId) => {
    try {
      // Simulate loading user content
      const mockContent = [
        {
          id: 1,
          title: "Faith in Difficult Times",
          type: "sermon",
          topic: "faith",
          style: "conversational",
          length: "medium",
          status: "completed",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          title: "The Fruit of the Spirit",
          type: "study",
          topic: "spiritual growth",
          style: "expository",
          length: "long",
          status: "completed",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      ]
      setUserContent(mockContent)
    } catch (error) {
      console.error('Error loading user content:', error)
    }
  }


  const remainingCreations = Math.max(0, 3 - usageCount)

  if (loading) {
    return (
      <Layout requireAuth={true}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DashboardSkeleton />
        </main>
      </Layout>
    )
  }

  return (
    <Layout requireAuth={true}>
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        user={user}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pastor'}!
          </h2>
          <p className="text-lg text-gray-600 mt-4">Let AI assist you in creating meaningful content for your ministry</p>
          
          {/* Pastor-focused reminder */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">Remember</span>
              </div>
              <p className="text-sm text-blue-700">
                AI is here to support your calling, not replace your pastoral wisdom. Use these tools as a starting point, then add your personal insights and the Holy Spirit&apos;s guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Sermon</h3>
            <p className="text-gray-600 mb-6">Create inspiring sermon outlines with AI assistance</p>
            <a
              href="/generate-sermon"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Start Creating
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Bible Study</h3>
            <p className="text-gray-600 mb-6">Create engaging Bible study outlines with AI assistance</p>
            <a
              href="/generate-study"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Start Creating
            </a>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Usage</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{usageCount}</div>
              <div className="text-gray-600">Total Generations</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{remainingCreations}</div>
              <div className="text-gray-600">Remaining This Month</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {subscriptionStatus ? 'Premium' : 'Free'}
              </div>
              <div className="text-gray-600">Current Plan</div>
            </div>
          </div>
        </div>

        {/* Content Analytics */}
        <div className="mb-8">
          <ContentAnalytics 
            userContent={userContent} 
            usageStats={{ totalGenerations: usageCount }}
          />
        </div>

        {/* Status Messages */}
        {subscriptionStatus ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-green-800">Premium Active</h3>
            </div>
            <p className="text-green-700">You have unlimited access to all features!</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-blue-800">Free Plan</h3>
            </div>
            <p className="text-blue-700 mb-4">
              You have {remainingCreations} generations remaining this month
            </p>
            <a
              href="/pricing"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Upgrade to Premium
            </a>
          </div>
        )}
      </main>
    </Layout>
  )
}