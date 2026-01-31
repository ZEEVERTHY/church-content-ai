import { NextResponse } from 'next/server'
import { generateSermon, generateOutline } from '../../../lib/openai'
import { supabase } from '../../../lib/supabase'
import { serverLog, serverError } from '../../../lib/logger'
import { withSecurity } from '../../../lib/security/middleware'
import { generationSchema } from '../../../lib/security/inputValidation'

/**
 * Generate API Route Handler
 * Secured with rate limiting, authentication, and input validation
 */
async function handleGenerate(request, { user, validatedData, rateLimitHeaders }) {
  try {
    serverLog('🔍 Unified Generate API: Starting generation...')
    
    // validatedData is already sanitized and validated
    const { input, mode, sermonOptions } = validatedData

    // Check if user has active subscription
    const { data: subscriptionData } = await supabase
      .from('user_subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const hasActiveSub = subscriptionData && subscriptionData.current_period_end > Math.floor(Date.now() / 1000)

    // Initialize totalUsage variable
    let totalUsage = 0

    // If no active subscription, check usage limits
    if (!hasActiveSub) {
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)

      if (usageError) {
        serverError('❌ Usage check error:', usageError)
        return NextResponse.json(
          { error: 'Unable to verify usage limits. Please try again.' }, 
          { status: 500, headers: rateLimitHeaders }
        )
      }

      totalUsage = usageData?.length || 0

      if (totalUsage >= 3) {
        return NextResponse.json(
          { 
            error: 'You have reached your limit of 3 total creations. Upgrade to Premium for unlimited access!',
            totalUsage: totalUsage,
            limitReached: true
          }, 
          { status: 403, headers: rateLimitHeaders }
        )
      }
    }

    serverLog(`🤖 Generating ${mode}:`, { input, userId: user.id, sermonOptions })

    // Generate based on mode
    let result
    let contentType

    if (mode === 'sermon') {
      // For sermon, pass options
      result = await generateSermon(
        input, 
        '', 
        'conversational', 
        'medium',
        sermonOptions || {}
      )
      contentType = 'sermon'
    } else {
      // For study, parse input as topic
      result = await generateOutline(input, 'adults', '60')
      contentType = 'study'
    }

    if (result.success) {
      // Track usage only if generation was successful
      const usageInsert = {
        user_id: user.id,
        content_type: contentType,
        created_at: new Date().toISOString()
      }
      
      const { error: insertError } = await supabase
        .from('user_usage')
        .insert(usageInsert)

      if (insertError) {
        serverError('❌ Error tracking usage:', insertError)
        // Still return success but log the tracking failure
      }

      const response = NextResponse.json({
        success: true,
        content: result.content,
        usage: result.usage,
        hasActiveSubscription: hasActiveSub,
        totalUsage: hasActiveSub ? 'unlimited' : (totalUsage + 1),
        remainingCreations: hasActiveSub ? 'unlimited' : Math.max(0, 2 - totalUsage),
      })
      
      // Add rate limit headers
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    } else {
      serverError(`❌ ${mode} generation failed:`, result.error)
      return NextResponse.json(
        { error: result.error || `Failed to generate ${mode}. Please try again.` }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }
  } catch (error) {
    serverError('❌ Generation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' }, 
      { status: 500 }
    )
  }
}

// Export secured handler
export const POST = withSecurity(handleGenerate, {
  requireAuth: true,
  rateLimitType: 'generation',
  validationSchema: generationSchema,
  allowedMethods: ['POST'],
})
