import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    console.log('🔍 Save API: Starting...')
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth header')
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { supabase } = await import('../../../lib/supabase')

    // Verify the token with Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.log('❌ Invalid token or user not found')
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const { title, content, content_type, topic, bible_verse, style } = await request.json()

    if (!title || !content || !content_type) {
      return NextResponse.json(
        { error: 'Title, content, and content_type are required' }, 
        { status: 400 }
      )
    }

    // Save content to library
    const { data, error } = await supabase
      .from('user_content')
      .insert({
        user_id: user.id,
        title,
        content,
        content_type,
        topic: topic || '',
        bible_verse: bible_verse || '',
        style: style || ''
      })
      .select()

    if (error) {
      console.error('Save content error:', error)
      return NextResponse.json(
        { error: 'Failed to save content' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Content saved to library',
      data: data[0]
    })
  } catch (error) {
    console.error('Save content error:', error)
    return NextResponse.json(
      { error: 'Failed to save content' }, 
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    // Get user's content library
    const { data, error } = await supabase
      .from('user_content')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get library error:', error)
      return NextResponse.json(
        { error: 'Failed to get library' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('Get library error:', error)
    return NextResponse.json(
      { error: 'Failed to get library' }, 
      { status: 500 }
    )
  }
}