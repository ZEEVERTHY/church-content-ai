// Global usage tracking utilities

// Dispatch a custom event when usage is updated
export const notifyUsageUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('usageUpdated'))
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