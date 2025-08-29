'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { getCurrentUsageCount, notifyUsageUpdate } from '../../lib/usageContext'

export default function GenerateSermon() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    verse: '',
    style: 'conversational',
    length: 'medium'
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
        // Get current usage count
        const count = await getCurrentUsageCount(supabase, session.user.id)
        setRemainingCreations(Math.max(0, 3 - count))
      } else {
        router.push('/auth')
      }
    }
    getUser()
  }, [router])

  // Listen for usage updates from other parts of the app
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

  const saveToLibrary = async () => {
    if (!generatedContent) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('Please sign in to save content')
        return
      }

      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: `Sermon: ${formData.topic}`,
          content: generatedContent,
          content_type: 'sermon',
          topic: formData.topic,
          bible_verse: formData.verse,
          style: formData.style
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Sermon saved to your library!')
      } else {
        alert('Error saving sermon: ' + data.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving sermon')
    }
  }

  const generateSermon = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedContent('')

    try {
      console.log('Frontend: Getting session token...')
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('Please sign in to generate content')
        setLoading(false)
        return
      }

      console.log('Frontend: Sending request to generate sermon...')
      
      const response = await fetch('/api/generate-sermon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedContent(data.content)
        // Update remaining creations immediately
        const newCount = await getCurrentUsageCount(supabase, session.user.id)
        setRemainingCreations(Math.max(0, 3 - newCount))
        // Notify other components
        notifyUsageUpdate()
      } else {
        setError(data.error || 'Failed to generate sermon')
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-indigo-600">ChurchContentAI</h1>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-indigo-600">← Dashboard</a>
              <div className="text-sm text-gray-500">
                {remainingCreations > 0 ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    {remainingCreations} creations left
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                    Limit reached
                  </span>
                )}
              </div>
              <span className="text-gray-700 text-sm">{user.user_metadata?.full_name || user.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Sermon Generator</h2>
          <p className="text-xl text-gray-600">Create inspiring, biblically-grounded sermons in minutes</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Sermon Details</h3>
            
            <form onSubmit={generateSermon} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sermon Topic *
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder="e.g., Faith in difficult times, God's love, Forgiveness"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bible Verse or Passage *
                </label>
                <input
                  type="text"
                  name="verse"
                  value={formData.verse}
                  onChange={handleInputChange}
                  placeholder="e.g., John 3:16, Romans 8:28, Psalm 23"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sermon Style
                </label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="conversational">Conversational & Relatable</option>
                  <option value="encouraging">Encouraging & Uplifting</option>
                  <option value="practical">Practical & Application-Focused</option>
                  <option value="evangelistic">Evangelistic & Gospel-Centered</option>
                  <option value="teaching">Teaching & Insight-Focused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sermon Length
                </label>
                <select
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="short">Short (10-15 minutes)</option>
                  <option value="medium">Medium (20-25 minutes)</option>
                  <option value="long">Long (30-35 minutes)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.topic || !formData.verse || remainingCreations <= 0}
                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium text-lg transition duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Generating Your Sermon...
                  </>
                ) : remainingCreations <= 0 ? (
                  'Creation Limit Reached'
                ) : (
                  'Generate Sermon'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Your Generated Sermon</h3>
            
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Creating your sermon...</p>
                <p className="text-sm text-gray-500 mt-2">This usually takes 15-30 seconds</p>
              </div>
            )}
            
            {generatedContent && !loading && (
              <div className="space-y-6">
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                      {generatedContent}
                    </pre>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent)
                      alert('Sermon copied to clipboard!')
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition duration-200"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedContent], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `sermon-${formData.topic.replace(/\s+/g, '-').toLowerCase()}.txt`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition duration-200"
                  >
                    Download as Text
                  </button>
                  <button
                    onClick={saveToLibrary}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium transition duration-200"
                  >
                    Save to Library
                  </button>
                </div>
              </div>
            )}

            {!generatedContent && !loading && (
              <div className="text-center py-12">
                <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-500 text-lg">Fill out the form and click Generate Sermon</p>
                <p className="text-gray-400 text-sm mt-2">Your AI-generated sermon will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}