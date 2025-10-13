'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { hasActiveSubscription, getUserSubscription } from '../../lib/usageContext'
import Image from 'next/image'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [totalUsageCount, setTotalUsageCount] = useState(0)
  const [subscription, setSubscription] = useState(null)
  const [hasActiveSub, setHasActiveSub] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const getSession = async () => {
      console.log('🔍 Dashboard: Checking session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      console.log('📊 Session data:', session)
      console.log('❌ Session error:', error)
      
      if (session) {
        console.log('✅ User is logged in:', session.user.email)
        setUser(session.user)
        loadTotalUsageCount(session.user.id)
        loadSubscriptionStatus(session.user.id)
      } else {
        console.log('❌ No session found, redirecting to auth...')
        // If not logged in, redirect to auth page
        router.push('/auth')
      }
      setLoading(false)
    }

    getSession()
  }, [router])

  const loadTotalUsageCount = async (userId) => {
    try {
      // Get total lifetime usage
      const { data, error } = await supabase
        .from('user_usage')
        .select('id')
        .eq('user_id', userId)

      if (error) {
        console.error('Error loading total usage count:', error)
      } else {
        setTotalUsageCount(data?.length || 0)
      }
    } catch (error) {
      console.error('Error loading total usage count:', error)
    }
  }

  const loadSubscriptionStatus = async (userId) => {
    try {
      // For now, skip subscription check to avoid 406 error
      // TODO: Implement this after database schema is set up
      console.log('🔍 Skipping subscription check for now')
      setHasActiveSub(false)
      setSubscription(null)
    } catch (error) {
      console.error('Error loading subscription status:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth page
  }

  const remainingCreations = hasActiveSub ? 'unlimited' : (3 - totalUsageCount)
  const isLimitReached = !hasActiveSub && totalUsageCount >= 3

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">ChurchContentAI</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                {hasActiveSub ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 sm:px-3 sm:py-2 rounded-full font-medium text-xs sm:text-sm">
                    ✅ Premium Active
                  </span>
                ) : !isLimitReached ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 sm:px-3 sm:py-2 rounded-full font-medium text-xs sm:text-sm">
                    ✅ {remainingCreations} remaining
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 sm:px-3 sm:py-2 rounded-full font-medium text-xs sm:text-sm">
                    ⛔ Limit reached
                  </span>
                )}
              </div>
              {!hasActiveSub && (
                <a
                  href="/pricing"
                  className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 text-xs sm:text-sm font-medium transition duration-200"
                >
                  Upgrade
                </a>
              )}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {user.user_metadata?.avatar_url && (
                  <Image 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                  />
                )}
                <span className="text-gray-700 text-xs sm:text-sm hidden sm:block">
                  Welcome, {user.user_metadata?.full_name || user.email}!
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 text-xs sm:text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your Content Dashboard</h2>
          <p className="text-lg sm:text-xl text-gray-600 px-4">Create amazing content for your ministry</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 px-4">
            {hasActiveSub ? (
              <span className="text-green-600 font-medium">Premium Plan - Unlimited Access</span>
            ) : (
              `Free Plan: ${totalUsageCount}/3 creations used`
            )}
          </p>
        </div>

        {/* Action Cards - Only 2 cards now, no library */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Generate Sermon</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Create a complete sermon from a Bible verse or topic
            </p>
            <button 
              onClick={() => router.push('/generate-sermon')}
              disabled={isLimitReached}
              className={`w-full py-3 rounded-lg transition duration-200 text-sm sm:text-base ${
                isLimitReached
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isLimitReached ? '⛔ Limit Reached' : hasActiveSub ? 'Create Unlimited' : 'Start Creating'}
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Bible Study Generator</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Build structured Bible study outlines and teaching materials
            </p>
            <button 
              onClick={() => router.push('/generate-study')}
              disabled={isLimitReached}
              className={`w-full py-3 rounded-lg transition duration-200 text-sm sm:text-base ${
                isLimitReached
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isLimitReached ? '⛔ Limit Reached' : hasActiveSub ? 'Create Unlimited' : 'Create Study Outline'}
            </button>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="mt-12 sm:mt-16 max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Usage Statistics</h3>
            <div className="flex items-center justify-center space-x-6 sm:space-x-8 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600">{totalUsageCount}</div>
                <div className="text-gray-500 text-xs sm:text-sm">Total Created</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${hasActiveSub ? 'text-green-600' : (remainingCreations > 0 ? 'text-green-600' : 'text-red-600')}`}>
                  {hasActiveSub ? '∞' : remainingCreations}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm">{hasActiveSub ? 'Unlimited' : 'Remaining'}</div>
              </div>
            </div>
            
            {/* Progress Bar - Only show for free users */}
            {!hasActiveSub && (
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-3 sm:h-4">
                  <div 
                    className={`h-3 sm:h-4 rounded-full transition-all duration-300 ${
                      isLimitReached ? 'bg-red-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${(totalUsageCount / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
                  <span>0 creations</span>
                  <span>3 creations (limit)</span>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {hasActiveSub ? (
              <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 text-sm sm:text-base">
                    <span className="font-medium">Premium Active!</span> You have unlimited access to all features. 
                    {subscription && (
                      <span className="block text-xs sm:text-sm mt-1">
                        Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : isLimitReached ? (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 text-sm sm:text-base">
                    <span className="font-medium">Creation limit reached!</span> You have used all 3 of your free creations. 
                    <a href="/pricing" className="underline ml-1">Upgrade your account for unlimited access.</a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-800 text-sm sm:text-base">
                    You have <span className="font-medium">{remainingCreations} creation{remainingCreations !== 1 ? 's' : ''} remaining</span> in your free account.
                    <a href="/pricing" className="underline ml-1">Upgrade for unlimited access.</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}