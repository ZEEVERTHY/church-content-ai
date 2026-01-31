'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navigation from './Navigation'

const Layout = ({ children, requireAuth = false, showNavigation = true }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
        setAuthChecked(true)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
        setAuthChecked(true)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = () => {
    setUser(null)
  }

  // Show loading spinner while checking auth
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to auth if authentication is required but user is not logged in
  if (requireAuth && !user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth'
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && Navigation && <Navigation user={user} onSignOut={handleSignOut} loading={loading} />}
      <main className={showNavigation ? "pt-16 sm:pt-20" : ""}>
        {children}
      </main>
    </div>
  )
}

export default Layout