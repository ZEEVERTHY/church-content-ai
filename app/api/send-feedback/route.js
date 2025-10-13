import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name, email, subject, message, type } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message || !type) {
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

    // If using EmailJS (recommended for simple setup)
    if (EMAIL_SERVICE_ID && EMAIL_TEMPLATE_ID && EMAIL_PUBLIC_KEY) {
      const emailData = {
        service_id: EMAIL_SERVICE_ID,
        template_id: EMAIL_TEMPLATE_ID,
        user_id: EMAIL_PUBLIC_KEY,
        template_params: {
          to_email: YOUR_EMAIL,
          from_name: name,
          from_email: email,
          subject: `[${type.toUpperCase()}] ${subject}`,
          message: message,
          type: type,
          reply_to: email
        }
      }

      const response = await fetch(EMAIL_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      if (response.ok) {
        console.log('✅ Feedback email sent successfully via EmailJS')
        return NextResponse.json({ success: true })
      } else {
        console.error('❌ EmailJS error:', await response.text())
        return NextResponse.json(
          { success: false, error: 'Failed to send email' },
          { status: 500 }
        )
      }
    }

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
