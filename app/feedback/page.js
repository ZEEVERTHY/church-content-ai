'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'feedback' // feedback or complaint
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: 'feedback'
        })
      } else {
        setError(data.error || 'Failed to send feedback. Please try again.')
      }
    } catch (error) {
      console.error('Error sending feedback:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 sm:py-6">
              <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">ChurchContentAI</h1>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm sm:text-base">← Dashboard</a>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your {formData.type} has been sent successfully. We&apos;ll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Send Another Message
              </button>
              <a
                href="/dashboard"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200 text-center"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">ChurchContentAI</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm sm:text-base">← Dashboard</a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Send Us Your Feedback</h2>
          <p className="text-lg sm:text-xl text-gray-600 px-4">
            We value your input! Share your thoughts, suggestions, or report any issues.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Type *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="feedback"
                    checked={formData.type === 'feedback'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm sm:text-base">Feedback</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="complaint"
                    checked={formData.type === 'complaint'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm sm:text-base">Complaint</span>
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief description of your message"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                placeholder="Please provide details about your feedback or complaint..."
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base resize-vertical"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium text-sm sm:text-base lg:text-lg transition duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                  <span className="text-sm sm:text-base">Sending...</span>
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-blue-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Ways to Reach Us</h3>
          <div className="space-y-2 text-sm sm:text-base text-gray-600">
            <p>📧 Email: support@churchcontentai.com</p>
            <p>⏰ Response Time: We typically respond within 24 hours</p>
            <p>🕒 Business Hours: Monday - Friday, 9 AM - 5 PM (WAT)</p>
          </div>
        </div>
      </main>
    </div>
  )
}
