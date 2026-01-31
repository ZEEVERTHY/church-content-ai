import { NextResponse } from 'next/server'
import { regenerateSermonSection } from '../../../lib/openai'
import { supabase } from '../../../lib/supabase'
import { serverLog, serverError } from '../../../lib/logger'
import { withSecurity } from '../../../lib/security/middleware'
import { regenerateSectionSchema } from '../../../lib/security/inputValidation'

/**
 * Regenerate Section API Handler
 * Secured with rate limiting, authentication, and input validation
 */
async function handleRegenerate(request, { user, validatedData, rateLimitHeaders }) {
  try {
    serverLog('🔍 Regenerate Section API: Starting...')
    
    // validatedData is already sanitized and validated
    const { section, originalSermon, originalInputs, additionalNote } = validatedData

    serverLog(`🤖 Regenerating section: ${section}`, { userId: user.id })

    // Regenerate the section
    const result = await regenerateSermonSection(
      section,
      originalSermon,
      originalInputs,
      additionalNote || ''
    )

    if (result.success) {
      const response = NextResponse.json({
        success: true,
        content: result.content,
        usage: result.usage
      })
      
      // Add rate limit headers
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    } else {
      serverError(`❌ Section regeneration failed:`, result.error)
      return NextResponse.json(
        { error: result.error || 'Failed to regenerate section. Please try again.' }, 
        { status: 500, headers: rateLimitHeaders }
      )
    }
  } catch (error) {
    serverError('❌ Regeneration error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' }, 
      { status: 500 }
    )
  }
}

// Export secured handler
export const POST = withSecurity(handleRegenerate, {
  requireAuth: true,
  rateLimitType: 'regeneration',
  validationSchema: regenerateSectionSchema,
  allowedMethods: ['POST'],
})
