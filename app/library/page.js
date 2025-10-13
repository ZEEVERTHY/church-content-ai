'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Library() {
  const [user, setUser] = useState(null)
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState(null)
  const [filter, setFilter] = useState('all') // all, sermon, study
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        loadLibrary()
      } else {
        router.push('/auth')
      }
    }
    getUser()
  }, [router])

  const loadLibrary = async () => {
    try {
      const response = await fetch('/api/save-content', {
        method: 'GET',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setContent(data.data)
      } else {
        console.error('Failed to load library:', data.error)
      }
    } catch (error) {
      console.error('Error loading library:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteContent = async (contentId) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const { error } = await supabase
        .from('user_content')
        .delete()
        .eq('id', contentId)

      if (error) {
        console.error('Delete error:', error)
        alert('Error deleting content')
      } else {
        setContent(content.filter(item => item.id !== contentId))
        setSelectedContent(null)
        alert('Content deleted successfully')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting content')
    }
  }

  const filteredContent = content.filter(item => {
    if (filter === 'all') return true
    return item.content_type === filter
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading your library...</p>
        </div>
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
              <span className="text-gray-700 text-xs sm:text-sm hidden sm:block">{user?.user_metadata?.full_name || user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Content Library</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">All your sermons and Bible studies in one place</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({content.length})
            </button>
            <button
              onClick={() => setFilter('sermon')}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                filter === 'sermon'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sermons ({content.filter(item => item.content_type === 'sermon').length})
            </button>
            <button
              onClick={() => setFilter('study')}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                filter === 'study'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Studies ({content.filter(item => item.content_type === 'study').length})
            </button>
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No content yet</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Start by creating your first sermon or Bible study</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a
                href="/generate-sermon"
                className="bg-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-indigo-700 transition duration-200 text-sm sm:text-base"
              >
                Create Sermon
              </a>
              <a
                href="/generate-study"
                className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 transition duration-200 text-sm sm:text-base"
              >
                Create Bible Study
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Content List */}
            <div className="lg:col-span-1">
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedContent(item)}
                    className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition duration-200 ${
                      selectedContent?.id === item.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {item.content_type === 'sermon' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              📖 Sermon
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              📚 Study
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.created_at)}
                        </p>
                        {item.topic && (
                          <p className="text-xs text-gray-600 mt-1">
                            Topic: {item.topic}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Preview */}
            <div className="lg:col-span-2">
              {selectedContent ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedContent.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Created: {formatDate(selectedContent.created_at)}</span>
                        {selectedContent.topic && <span>Topic: {selectedContent.topic}</span>}
                        {selectedContent.bible_verse && <span>Verse: {selectedContent.bible_verse}</span>}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedContent.content)
                          alert('Content copied to clipboard!')
                        }}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([selectedContent.content], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `${selectedContent.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        }}
                        className="text-green-600 hover:text-green-800 p-2"
                        title="Download"
                      >
                        💾
                      </button>
                      <button
                        onClick={() => deleteContent(selectedContent.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                      {selectedContent.content}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select content to preview</h3>
                  <p className="text-gray-500">Click on any item from your library to view, copy, or download it</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}