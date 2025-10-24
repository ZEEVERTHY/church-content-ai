// Client-side email service using EmailJS
export const sendFeedbackEmail = async (feedbackData) => {
  try {
    // Check if EmailJS is configured
    const serviceId = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      console.log('📧 EmailJS not configured, falling back to API')
      return await sendFeedbackViaAPI(feedbackData)
    }

    // Import EmailJS dynamically (client-side only)
    const emailjs = (await import('@emailjs/browser')).default

    const templateParams = {
      to_email: process.env.NEXT_PUBLIC_FEEDBACK_EMAIL || 'your-email@example.com',
      from_name: feedbackData.name,
      from_email: feedbackData.email,
      subject: `[${feedbackData.type.toUpperCase()}] ${feedbackData.subject}`,
      message: feedbackData.message,
      type: feedbackData.type,
      reply_to: feedbackData.email
    }

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    )

    console.log('✅ Email sent successfully:', result)
    return { success: true, result }
  } catch (error) {
    console.error('❌ EmailJS error:', error)
    // Fallback to API
    return await sendFeedbackViaAPI(feedbackData)
  }
}

// Fallback API method
const sendFeedbackViaAPI = async (feedbackData) => {
  try {
    const response = await fetch('/api/send-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('❌ API fallback error:', error)
    return { success: false, error: 'Failed to send feedback' }
  }
}
