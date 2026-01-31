import { NextResponse } from 'next/server'
import { generateSermon } from '../../../lib/openai'
import { supabase } from '../../../lib/supabase'
import { serverLog, serverError } from '../../../lib/logger'

export async function POST(request) {
  try {
    serverLog('🔍 Sermon API: Starting generation...')
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify the token with Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      serverError('❌ Invalid token or user not found:', userError?.message)
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

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
          { status: 500 }
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
          { status: 403 }
        )
      }
    }

    // Get the request data
    const { topic, verse, style, length } = await request.json()

    // Validate required fields
    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' }, 
        { status: 400 }
      )
    }

    serverLog('🤖 Generating sermon:', { topic, verse, style, length, userId: user.id })

    // Generate the sermon using OpenAI
    const result = await generateSermon(topic, verse, style, length)

    if (result.success) {
      // Track usage only if generation was successful
      const usageInsert = {
        user_id: user.id,
        content_type: 'sermon',
        created_at: new Date().toISOString()
      }
      
      const { error: insertError } = await supabase
        .from('user_usage')
        .insert(usageInsert)

      if (insertError) {
        serverError('❌ Error tracking usage:', insertError)
        // Still return success but log the tracking failure
      }

      return NextResponse.json({
        success: true,
        content: result.content,
        usage: result.usage,
        hasActiveSubscription: hasActiveSub,
        totalUsage: hasActiveSub ? 'unlimited' : (totalUsage + 1),
        remainingCreations: hasActiveSub ? 'unlimited' : Math.max(0, 2 - totalUsage),
      })
    } else {
      serverError('❌ Sermon generation failed:', result.error)
      return NextResponse.json(
        { error: result.error || 'Failed to generate sermon. Please try again.' }, 
        { status: 500 }
      )
    }
  } catch (error) {
    serverError('❌ Sermon generation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' }, 
      { status: 500 }
    )
  }
}