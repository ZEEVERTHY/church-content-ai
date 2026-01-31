import { NextResponse } from 'next/server'
import { withSecurity } from '../../../lib/security/middleware'
import { saveContentSchema } from '../../../lib/security/inputValidation'
import { supabase } from '../../../lib/supabase'
import { serverLog, serverError } from '../../../lib/logger'

/**
 * Save Content API Handler
 * Secured with rate limiting, authentication, and input validation
 */
async function handleSave(request, { user, validatedData, rateLimitHeaders }) {
  try {
    serverLog('🔍 Save API: Starting...')
    
    // validatedData is already sanitized and validated
    const { title, content, content_type, topic, bible_verse, style, structured_data } = validatedData

    // Build insert object (structured_data is optional - column may not exist in DB)
    const insertData = {
      user_id: user.id,
      title,
      content,
      content_type,
      topic: topic || '',
      bible_verse: bible_verse || '',
      style: style || ''
    }

    // Add structured_data if provided (will be ignored if column doesn't exist)
    if (structured_data) {
      // Validate JSON structure
      try {
        const parsed = JSON.parse(structured_data)
        insertData.structured_data = structured_data
      } catch (e) {
        serverError('Invalid structured_data JSON:', e)
        // Continue without structured_data
      }
    }

    // Save content to library
    const { data, error } = await supabase
      .from('user_content')
      .insert(insertData)
      .select()

    if (error) {
      serverError('Save content error:', error)
      return NextResponse.json(
        { error: 'Failed to save content' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }

    const response = NextResponse.json({
      success: true,
      message: 'Content saved to library',
      data: data[0]
    })
    
    // Add rate limit headers
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    serverError('Save content error:', error)
    return NextResponse.json(
      { error: 'Failed to save content' }, 
      { status: 500 }
    )
  }
}

// Export secured handler
export const POST = withSecurity(handleSave, {
  requireAuth: true,
  rateLimitType: 'save',
  validationSchema: saveContentSchema,
  allowedMethods: ['POST'],
})

/**
 * Update Content API Handler
 * Secured with rate limiting, authentication, and input validation
 */
async function handleUpdate(request, { user, validatedData, rateLimitHeaders }) {
  try {
    // validatedData contains sanitized and validated input
    const { id, content, title } = validatedData
    
    // Update content
    const { data, error } = await supabase
      .from('user_content')
      .update({
        content,
        ...(title && { title }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own content
      .select()

    if (error) {
      serverError('Update content error:', error)
      return NextResponse.json(
        { error: 'Failed to update content' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Content not found or unauthorized' }, 
        { status: 404, headers: rateLimitHeaders }
      )
    }

    const response = NextResponse.json({
      success: true,
      message: 'Content updated',
      data: data[0]
    })
    
    // Add rate limit headers
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    serverError('Update content error:', error)
    return NextResponse.json(
      { error: 'Failed to update content' }, 
      { status: 500 }
    )
  }
}

// Update schema for PUT requests
const updateContentSchema = {
  id: {
    type: 'string',
    required: true,
    validate: (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value),
  },
  content: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50000,
    sanitize: 'html',
  },
  title: {
    type: 'string',
    required: false,
    maxLength: 200,
    sanitize: true,
  },
}

// Export secured handler
export const PUT = withSecurity(handleUpdate, {
  requireAuth: true,
  rateLimitType: 'save',
  validationSchema: updateContentSchema,
  allowedMethods: ['PUT'],
})

/**
 * Delete Content API Handler
 * Secured with rate limiting, authentication, and input validation
 */
async function handleDelete(request, { user, validatedData, rateLimitHeaders }) {
  try {
    const { id } = validatedData
    
    // Delete content (user can only delete their own)
    const { error } = await supabase
      .from('user_content')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only delete their own content

    if (error) {
      serverError('Delete content error:', error)
      return NextResponse.json(
        { error: 'Failed to delete content' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }

    const response = NextResponse.json({
      success: true,
      message: 'Content deleted'
    })
    
    // Add rate limit headers
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    serverError('Delete content error:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' }, 
      { status: 500 }
    )
  }
}

// Delete schema
const deleteContentSchema = {
  id: {
    type: 'string',
    required: true,
    validate: (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value),
  },
}

// Export secured handler
export const DELETE = withSecurity(handleDelete, {
  requireAuth: true,
  rateLimitType: 'save',
  validationSchema: deleteContentSchema,
  allowedMethods: ['DELETE'],
})

/**
 * Get Content Library API Handler
 * Secured with rate limiting and authentication
 */
async function handleGet(request, { user, rateLimitHeaders }) {
  try {
    // Get user's content library (user can only see their own)
    const { data, error } = await supabase
      .from('user_content')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100) // Limit to prevent excessive data transfer

    if (error) {
      serverError('Get library error:', error)
      return NextResponse.json(
        { error: 'Failed to get library' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }

    const response = NextResponse.json({
      success: true,
      data: data || []
    })
    
    // Add rate limit headers
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    serverError('Get library error:', error)
    return NextResponse.json(
      { error: 'Failed to get library' }, 
      { status: 500 }
    )
  }
}

// Export secured handler (no validation schema needed for GET)
export const GET = withSecurity(handleGet, {
  requireAuth: true,
  rateLimitType: 'save',
  validationSchema: null,
  allowedMethods: ['GET'],
})