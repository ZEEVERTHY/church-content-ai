/**
 * Auth helper functions for handling Supabase authentication errors
 */

/**
 * Handles Supabase auth errors, especially refresh token errors
 * @param {Error} error - The error from Supabase
 * @returns {Object} - { shouldRedirect: boolean, message: string }
 */
export function handleAuthError(error) {
  // Check if it's a refresh token error
  if (error?.message?.includes('Refresh Token') || 
      error?.message?.includes('refresh_token') ||
      error?.status === 401 ||
      error?.code === 'PGRST301') {
    
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      try {
        // Clear Supabase session storage
        localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token')
        // Clear all Supabase-related items
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            localStorage.removeItem(key)
          }
        })
      } catch (e) {
        console.error('Error clearing storage:', e)
      }
    }
    
    return {
      shouldRedirect: true,
      message: 'Your session has expired. Please sign in again.'
    }
  }
  
  return {
    shouldRedirect: false,
    message: error?.message || 'An authentication error occurred'
  }
}

/**
 * Safely gets the current session with error handling
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} - { session, error, shouldRedirect }
 */
export async function getSessionSafely(supabase) {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      const handled = handleAuthError(error)
      return {
        session: null,
        error: handled.message,
        shouldRedirect: handled.shouldRedirect
      }
    }
    
    return {
      session,
      error: null,
      shouldRedirect: false
    }
  } catch (error) {
    const handled = handleAuthError(error)
    return {
      session: null,
      error: handled.message,
      shouldRedirect: handled.shouldRedirect
    }
  }
}

/**
 * Refreshes the session with error handling
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} - { session, error, shouldRedirect }
 */
export async function refreshSessionSafely(supabase) {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    
    if (error) {
      const handled = handleAuthError(error)
      return {
        session: null,
        error: handled.message,
        shouldRedirect: handled.shouldRedirect
      }
    }
    
    return {
      session,
      error: null,
      shouldRedirect: false
    }
  } catch (error) {
    const handled = handleAuthError(error)
    return {
      session: null,
      error: handled.message,
      shouldRedirect: handled.shouldRedirect
    }
  }
}
