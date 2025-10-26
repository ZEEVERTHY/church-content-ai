'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { getCurrentUsageCount, notifyUsageUpdate } from '../../lib/usageContext'
import GeneratePageLayout from '../../components/layout/GeneratePageLayout'
import BackButton from '../../components/ui/BackButton'

export default function GenerateStudy() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    audience: 'adults',
    duration: '60'
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [error, setError] = useState('')
  const [remainingCreations, setRemainingCreations] = useState(3)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const count = await getCurrentUsageCount(supabase, session.user.id)
        setRemainingCreations(Math.max(0, 3 - count))
      } else {
        router.push('/auth')
      }
    }
    getUser()
  }, [router])

  useEffect(() => {
    const handleUsageUpdate = async () => {
      if (user) {
        const count = await getCurrentUsageCount(supabase, user.id)
        setRemainingCreations(Math.max(0, 3 - count))
      }
    }

    window.addEventListener('usageUpdated', handleUsageUpdate)
    return () => window.removeEventListener('usageUpdated', handleUsageUpdate)
  }, [user])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Immediate UI updates for better perceived performance
    setLoading(true)
    setError('')
    setGeneratedContent('')
    
    // Show optimistic loading message immediately
    setGeneratedContent('📚 AI is preparing your Bible study... This usually takes 10-15 seconds.')
    
    try {
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study')
      }

      // Immediate content update
      setGeneratedContent(data.content)
      notifyUsageUpdate()
    } catch (error) {
      console.error('Error generating study:', error)
      setError(error.message || 'Failed to generate study. Please try again.')
      setGeneratedContent('') // Clear optimistic content on error
    } finally {
      setLoading(false)
    }
  }

  const isLimitReached = remainingCreations <= 0

  return (
    <GeneratePageLayout>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackButton href="/dashboard" className="mb-4">
            Back to Dashboard
          </BackButton>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Bible Study Preparation Assistant</h2>
          <p className="text-lg text-gray-600 mt-4">Let AI help you create structured Bible study guides, then add your teaching style and pastoral insights</p>
          
          {/* Pastor-focused guidance */}
          <div className="mt-6 max-w-3xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start">
                <div className="shrink-0">
                  <svg className="w-5 h-5 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Pastor&apos;s Note</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Use AI-generated study outlines as a foundation, then customize them with your teaching approach, group dynamics, and the specific needs of your congregation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Status */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {remainingCreations} generations remaining
                </h3>
                <p className="text-gray-600">
                  {isLimitReached 
                    ? 'Upgrade to Premium for unlimited generations' 
                    : 'Free plan includes 3 generations per month'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Study Details</h3>
              <p className="text-gray-600">Provide the topic and details for your Bible study</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Topic *
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder="e.g., The Fruit of the Spirit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    name="audience"
                    value={formData.audience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  >
                    <option value="adults">Adults</option>
                    <option value="youth">Youth</option>
                    <option value="children">Children</option>
                    <option value="mixed">Mixed Ages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Duration (minutes)
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || isLimitReached}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    loading || isLimitReached
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : isLimitReached ? (
                    'Upgrade Required'
                  ) : (
                    'Generate Study'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Generated Content */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Generated Study</h3>
              <p className="text-gray-600">Your AI-generated Bible study outline will appear here</p>
            </div>

            <div className="p-6">
              {generatedContent ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed animate-fadeIn">
                    {generatedContent}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Fill out the form and click &quot;Generate Study&quot; to create your outline</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade Prompt */}
        {isLimitReached && (
          <div className="mt-8 bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
            <p className="text-gray-600 mb-6">
              Get unlimited Bible study generations for just ₦5,000/month
            </p>
            <button 
              onClick={() => router.push('/pricing')}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </main>
    </GeneratePageLayout>
  )
}