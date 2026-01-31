import { NextResponse } from 'next/server'
import { serverLog, serverError } from '../../../lib/logger'
import { withSecurity } from '../../../lib/security/middleware'
import { validateEmail, sanitizeString } from '../../../lib/security/inputValidation'

/**
 * Feedback API Handler
 * Secured with rate limiting and input validation
 */
async function handleFeedback(request, { validatedData, rateLimitHeaders }) {
  try {
    // validatedData is already sanitized and validated
    const { userName, userEmail, subject, message, type } = validatedData

    const feedbackEmail = process.env.FEEDBACK_EMAIL
    const emailServiceId = process.env.EMAIL_SERVICE_ID
    const emailTemplateId = process.env.EMAIL_TEMPLATE_ID
    const emailPublicKey = process.env.EMAIL_PUBLIC_KEY

    // Try to send email if EmailJS is configured
    if (emailServiceId && emailTemplateId && emailPublicKey && feedbackEmail) {
      try {
        // EmailJS requires client-side, so we'll use a server-side alternative
        // For now, log the feedback (in production, integrate with Resend, SendGrid, etc.)
        serverLog('📧 Feedback received (email service configured but needs server-side implementation):', {
          type,
          from: userEmail,
          subject
        })
        
        // TODO: Implement server-side email service (Resend, SendGrid, Nodemailer, etc.)
        // For now, return success and log
        return NextResponse.json({ 
          success: true, 
          message: 'Feedback received. Thank you for your input!' 
        })
      } catch (emailError) {
        serverError('❌ Email sending error:', emailError)
        // Continue to fallback logging
      }
    }

    // Fallback: Log feedback (for development or when email not configured)
    serverLog('📧 FEEDBACK RECEIVED:')
    serverLog('=====================================')
    serverLog(`Type: ${type.toUpperCase()}`)
    serverLog(`From: ${userName} <${userEmail}>`)
    serverLog(`Subject: ${subject}`)
    serverLog(`Message: ${message}`)
    serverLog('=====================================')

    // Return success - feedback is logged
    const response = NextResponse.json({ 
      success: true, 
      message: 'Feedback received. Thank you for your input!' 
    })
    
    // Add rate limit headers
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response

  } catch (error) {
    serverError('❌ Error processing feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

// Feedback schema
const feedbackSchema = {
  userName: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100,
    sanitize: true,
  },
  userEmail: {
    type: 'string',
    required: true,
    validate: validateEmail,
  },
  subject: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true,
  },
  message: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 2000,
    sanitize: true,
  },
  type: {
    type: 'string',
    required: true,
    enum: ['bug', 'feature', 'feedback', 'other'],
  },
}

// Export secured handler (no auth required for feedback)
export const POST = withSecurity(handleFeedback, {
  requireAuth: false,
  rateLimitType: 'public',
  validationSchema: feedbackSchema,
  allowedMethods: ['POST'],
})
