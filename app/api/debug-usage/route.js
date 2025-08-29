import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request) {
  try {
    console.log('🔍 Debug API: Checking usage data...')
    
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
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    // Get ALL usage records for this user
    const { data: allUsage, error: usageError } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (usageError) {
      console.error('Usage check error:', usageError)
      return NextResponse.json(
        { error: `Database error: ${usageError.message}` }, 
        { status: 500 }
      )
    }

    console.log('📊 All usage records:', allUsage)

    return NextResponse.json({
      success: true,
      userId: user.id,
      userEmail: user.email,
      totalRecords: allUsage?.length || 0,
      usageRecords: allUsage || [],
      debug: {
        tableExists: allUsage !== null,
        hasRecords: (allUsage?.length || 0) > 0
      }
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error.message }, 
      { status: 500 }
    )
  }
}