import { NextResponse } from 'next/server'
import { generateOutline } from '../../../lib/openai'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    console.log('🔍 Outline API: Starting generation...')
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    console.log('🔍 Auth header exists:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth header')
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify the token with Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    console.log('📊 User exists:', !!user)
    console.log('👤 User ID:', user?.id)
    
    if (userError || !user) {
      console.log('❌ Invalid token or user not found:', userError)
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    // Check if user has active subscription
    console.log('🔍 Checking subscription status for user:', user.id)
    
    const { data: subscriptionData, error: subError } = await supabase
      .from('user_subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const hasActiveSub = subscriptionData && subscriptionData.current_period_end > Math.floor(Date.now() / 1000)
    console.log('📊 Has active subscription:', hasActiveSub)

    // Initialize totalUsage variable
    let totalUsage = 0

    // If no active subscription, check usage limits
    if (!hasActiveSub) {
      console.log('🔍 Checking usage for user:', user.id)
      
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)

      console.log('📊 Usage query result:', { usageData, usageError })

      if (usageError) {
        console.error('❌ Usage check error:', usageError)
        return NextResponse.json(
          { error: `Database error: ${usageError.message}` }, 
          { status: 500 }
        )
      }

      totalUsage = usageData?.length || 0
      console.log('📊 Total lifetime usage:', totalUsage)

      if (totalUsage >= 3) {
        console.log('🛑 User has reached limit!')
        return NextResponse.json(
          { 
            error: 'You have reached your limit of 3 total creations. Upgrade for unlimited access!',
            totalUsage: totalUsage,
            limitReached: true
          }, 
          { status: 403 }
        )
      }
    }

    const { topic, targetAudience, duration } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' }, 
        { status: 400 }
      )
    }

    console.log('🤖 Generating outline with:', { topic, targetAudience, duration })

    // Generate the outline using OpenAI
    const result = await generateOutline(topic, targetAudience, duration)

    if (result.success) {
      console.log('✅ Outline generated successfully, now tracking usage...')
      
      // Track usage - CRITICAL: Make sure this insert works
      const usageInsert = {
        user_id: user.id,
        content_type: 'study',
        created_at: new Date().toISOString()
      }
      
      console.log('💾 Inserting usage record:', usageInsert)
      
      const { data: insertData, error: insertError } = await supabase
        .from('user_usage')
        .insert(usageInsert)
        .select()

      console.log('💾 Insert result:', { insertData, insertError })

      if (insertError) {
        console.error('❌ CRITICAL: Error tracking usage:', insertError)
        // Still return success but log the tracking failure
      } else {
        console.log('✅ Usage tracked successfully')
      }

      return NextResponse.json({
        success: true,
        content: result.content,
        usage: result.usage,
        hasActiveSubscription: hasActiveSub,
        totalUsage: hasActiveSub ? 'unlimited' : (totalUsage + 1),
        remainingCreations: hasActiveSub ? 'unlimited' : (2 - totalUsage),
        debug: {
          usageTracked: !insertError,
          insertError: insertError?.message || null
        }
      })
    } else {
      console.error('❌ Outline generation failed:', result.error)
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Outline generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate outline', details: error.message }, 
      { status: 500 }
    )
  }
}