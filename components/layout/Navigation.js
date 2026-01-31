'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { ThemeToggle } from '../ui/ThemeToggle'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

// Simple Navigation component (avoiding Header import issues)
const Navigation = ({ user, onSignOut, loading = false }) => {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onSignOut?.()
    router.push('/')
    setShowUserMenu(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  // Always render the same structure to avoid hydration mismatches
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border" suppressHydrationWarning>
      <nav className="flex h-14 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Left: Logo (click → dashboard) - Always use /dashboard to avoid hydration mismatch */}
        <Link 
          href="/dashboard"
          className="font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span suppressHydrationWarning>ChurchContentAI</span>
        </Link>
        
        {/* Center: Empty (keep it calm) */}
        <div className="flex-1"></div>
        
        {/* Right: Pricing, Theme, User menu */}
        <div className="flex items-center gap-3" suppressHydrationWarning>
          {loading ? (
            <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
          ) : user ? (
            <>
              <Link href="/pricing" className="px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Pricing
              </Link>
              <ThemeToggle />
              {/* User Menu Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground text-foreground transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {userInitial}
                  </div>
                  <span className="hidden sm:inline">{userName}</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showUserMenu && "rotate-180")} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      {/* User Info */}
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            // Profile will be added later
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left"
                          disabled
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile</span>
                          <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/pricing" className="px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Pricing
              </Link>
              <ThemeToggle />
              <Link href="/auth" className="px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Sign In
              </Link>
              <Link href="/auth" className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navigation
