import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    console.log('📧 Feedback API called')
    
    const { name, email, subject, message, type } = await request.json()
    console.log('📧 Received feedback:', { name, email, subject, type })

    // Validate required fields
    if (!name || !email || !subject || !message || !type) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email configuration
    const YOUR_EMAIL = process.env.FEEDBACK_EMAIL || 'your-email@example.com'
    const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'https://api.emailjs.com/api/v1.0/email/send'
    const EMAIL_SERVICE_ID = process.env.EMAIL_SERVICE_ID
    const EMAIL_TEMPLATE_ID = process.env.EMAIL_TEMPLATE_ID
    const EMAIL_PUBLIC_KEY = process.env.EMAIL_PUBLIC_KEY

    console.log('📧 Email config check:', {
      hasServiceId: !!EMAIL_SERVICE_ID,
      hasTemplateId: !!EMAIL_TEMPLATE_ID,
      hasPublicKey: !!EMAIL_PUBLIC_KEY,
      feedbackEmail: YOUR_EMAIL
    })

    // Note: EmailJS only works client-side, not in API routes
    // For now, we'll log the feedback and return success
    // EmailJS integration should be moved to client-side if needed

    // Fallback: Log to console (for development)
    console.log('📧 FEEDBACK EMAIL (Email service not configured):')
    console.log('=====================================')
    console.log(`Type: ${type.toUpperCase()}`)
    console.log(`From: ${name} <${email}>`)
    console.log(`Subject: ${subject}`)
    console.log(`Message: ${message}`)
    console.log('=====================================')

    // In production, you should implement a proper email service
    // For now, we'll return success but log the feedback
    return NextResponse.json({ 
      success: true, 
      message: 'Feedback received (email service not configured)' 
    })

  } catch (error) {
    console.error('❌ Error processing feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
