import { createClient } from '@supabase/supabase-js'

// Get the URL and Key from our environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create the connection to Supabase with better error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Handle errors gracefully
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: `sb-${supabaseUrl?.split('//')[1]?.split('.')[0]}-auth-token`,
  },
  global: {
    headers: {
      'x-client-info': 'churchcontentai-web'
    }
  }
})

// Add global error handler for auth errors
if (typeof window !== 'undefined') {
  // Listen for auth state changes and handle errors
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      // Session was refreshed or user signed out
      console.log('Auth state changed:', event)
    }
    
    // Handle token refresh errors
    if (event === 'TOKEN_REFRESHED' && !session) {
      // Token refresh failed, clear storage
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            localStorage.removeItem(key)
          }
        })
        // Redirect to auth page
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth'
        }
      } catch (e) {
        console.error('Error clearing storage:', e)
      }
    }
  })
}

// This is like creating a phone line to talk to Supabase
// We can now use 'supabase' anywhere in our app to:
// - Sign up users
// - Log in users  
// - Store and retrieve data