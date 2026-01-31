'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { getCurrentUsageCount, hasActiveSubscription } from '../../lib/usageContext'
import Navigation from '../../components/layout/Navigation'
import { DashboardSkeleton } from '../../components/ui/SkeletonLoader'
import OnboardingModal from '../../components/ui/OnboardingModal'
import SimpleUI from '../../components/ui/simple-ui'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usageCount, setUsageCount] = useState(0)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()

  const loadUsageData = useCallback(async (userId) => {
    try {
      const count = await getCurrentUsageCount(supabase, userId)
      setUsageCount(count)
      
      const hasSubscription = await hasActiveSubscription(supabase, userId)
      setSubscriptionStatus(hasSubscription)

      // Onboarding disabled - pastors want to work immediately
      // No tutorial, no distractions
      // if (typeof window !== 'undefined') {
      //   const onboardingCompleted = localStorage.getItem('onboardingCompleted')
      //   if (!onboardingCompleted && count === 0) {
      //     setShowOnboarding(true)
      //   }
      // }
    } catch (error) {
      // Don't redirect on usage data errors, just log them
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        // Handle refresh token errors specifically
        if (error) {
          console.error('Session error:', error)
          
          // If it's a refresh token error, clear storage and redirect
          if (error.message?.includes('Refresh Token') || 
              error.message?.includes('refresh_token') ||
              error.status === 401) {
            // Clear invalid tokens
            if (typeof window !== 'undefined') {
              try {
                Object.keys(localStorage).forEach(key => {
                  if (key.includes('supabase') || key.includes('sb-')) {
                    localStorage.removeItem(key)
                  }
                })
              } catch (e) {
                console.error('Error clearing storage:', e)
              }
            }
          }
          
          router.push('/auth')
          return
        }
        
        if (session && session.user) {
          setUser(session.user)
          await loadUsageData(session.user.id)
        } else {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Get user error:', error)
        
        // Handle refresh token errors in catch block too
        if (error.message?.includes('Refresh Token') || 
            error.message?.includes('refresh_token')) {
          if (typeof window !== 'undefined') {
            try {
              Object.keys(localStorage).forEach(key => {
                if (key.includes('supabase') || key.includes('sb-')) {
                  localStorage.removeItem(key)
                }
              })
            } catch (e) {
              console.error('Error clearing storage:', e)
            }
          }
        }
        
        router.push('/auth')
      }
    }
    getUser()
  }, [router, loadUsageData])

  // Listen for usage updates
  useEffect(() => {
    // Only add event listener on client side
    if (typeof window === 'undefined') return
    
    const handleUsageUpdate = async () => {
      if (user) {
        await loadUsageData(user.id)
      }
    }

    window.addEventListener('usageUpdated', handleUsageUpdate)
    return () => window.removeEventListener('usageUpdated', handleUsageUpdate)
  }, [user, loadUsageData])

  // Handle onboarding completion (avoid hydration issues)
  useEffect(() => {
    if (!showOnboarding && user) {
      localStorage.setItem('onboardingCompleted', 'true')
    }
  }, [showOnboarding, user])

  const handleSignOut = () => {
    setUser(null)
  }

  // Calculate userName - do this before conditional returns to ensure consistent hook order
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pastor'

  // Always render the same structure - no conditional returns
  // CRITICAL: All components must be rendered in the same order every time
  return (
    <div className="min-h-screen bg-background text-foreground" suppressHydrationWarning>
      <Navigation user={user} onSignOut={handleSignOut} loading={loading} />
      
      {/* Always render OnboardingModal - same hook order every render */}
      <OnboardingModal 
        isOpen={showOnboarding && !!user && !loading} 
        onClose={() => {
          setShowOnboarding(false)
        }}
        user={user}
      />

      {/* Always render SimpleUI - CRITICAL: Always render to maintain hook consistency */}
      <SimpleUI
        usageCount={loading ? 0 : usageCount}
        isPro={loading ? false : subscriptionStatus}
        userName={loading ? 'Pastor' : userName}
      />

      {/* Always render loading skeleton - hide with CSS to maintain structure */}
      <main 
        className="pt-16 sm:pt-20 absolute inset-0 bg-gray-50 z-10" 
        style={{ display: loading ? 'block' : 'none' }}
        suppressHydrationWarning
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DashboardSkeleton />
        </div>
      </main>
    </div>
  )
}
