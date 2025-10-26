// Global usage tracking utilities

// Dispatch a custom event when usage is updated
export const notifyUsageUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('usageUpdated'))
  }
}

// Check if user has active subscription
export const hasActiveSubscription = async (supabase, userId) => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error) {
      console.log('🔍 Subscription query error:', error.message)
      // If table doesn't exist or RLS blocks access, assume no subscription
      if (error.code === 'PGRST116' || error.code === '42501') {
        console.log('📋 Subscription table not accessible, assuming free tier')
        return false
      }
      return false
    }

    if (!data) {
      return false
    }

    // Check if subscription is still valid (not expired)
    const now = Math.floor(Date.now() / 1000)
    return data.current_period_end > now
  } catch (error) {
    console.error('❌ Error checking subscription status:', error)
    return false
  }
}

// Get user's subscription details
export const getUserSubscription = async (supabase, userId) => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return null
    }

    // Check if subscription is still valid
    const now = Math.floor(Date.now() / 1000)
    if (data.current_period_end <= now) {
      return null // Subscription expired
    }

    return data
  } catch (error) {
    console.error('Error getting user subscription:', error)
    return null
  }
}

// Get current usage count for a user
export const getCurrentUsageCount = async (supabase, userId) => {
  try {
    const { data, error } = await supabase
      .from('user_usage')
      .select('id')
      .eq('user_id', userId)

    if (error) {
      console.error('Error getting usage count:', error)
      return 0
    }

    return data?.length || 0
  } catch (error) {
    console.error('Error getting usage count:', error)
    return 0
  }
}

// Check if user has reached limit
export const hasReachedLimit = async (supabase, userId) => {
  const count = await getCurrentUsageCount(supabase, userId)
  return count >= 3
}

// Track a new creation and notify all components
export const trackUsage = async (supabase, userId, contentType) => {
  try {
    const { error } = await supabase
      .from('user_usage')
      .insert({
        user_id: userId,
        content_type: contentType
      })

    if (error) {
      console.error('Error tracking usage:', error)
      return false
    }

    // Notify all components that usage was updated
    notifyUsageUpdate()
    return true
  } catch (error) {
    console.error('Error tracking usage:', error)
    return false
  }
}