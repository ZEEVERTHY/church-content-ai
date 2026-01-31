'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, BookOpen, FileText, Copy, Check, ChevronDown, ChevronUp, Settings, Save, Edit2, RefreshCw, X, Library, Trash2 } from 'lucide-react'
import { LimitModal } from './limit-modal'
import { FREE_TIER_LIMIT } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from './chat-input'
import { useGenerate } from '@/hooks/useGenerate'
import { supabase } from '@/lib/supabase'
import { parseSermonSections } from '@/lib/sermonParser'

export default function SimpleUI({ 
  usageCount = 0, 
  isPro = false,
  userName = 'Pastor'
}) {
  const router = useRouter()
  const [mode, setMode] = useState('sermon')
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [savedContent, setSavedContent] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [showLibrary, setShowLibrary] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [libraryFilter, setLibraryFilter] = useState('all') // 'all', 'sermon', 'study'
  const [editingLibraryId, setEditingLibraryId] = useState(null)
  const [editLibraryContent, setEditLibraryContent] = useState('')
  const [regeneratingSection, setRegeneratingSection] = useState(null) // { messageId, section }
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)
  const [regenerateNote, setRegenerateNote] = useState('')
  const messagesEndRef = useRef(null)
  const { generate, loading, output, error, reset } = useGenerate()
  
  // Advanced options with defaults (users can ignore) - Spec requirements only
  const [audience, setAudience] = useState('adults')
  const [teachingStyle, setTeachingStyle] = useState('narrative')
  const [culturalContext, setCulturalContext] = useState('global')
  const [tone, setTone] = useState('encouraging')
  const [length, setLength] = useState('medium')
  
  // Calculate remaining generations
  const remaining = isPro ? 'unlimited' : Math.max(0, FREE_TIER_LIMIT - usageCount)
  const canGenerate = isPro || usageCount < FREE_TIER_LIMIT

  // Set mounted state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, output])

  const handleGenerate = async (value) => {
    const userMessage = (value || message).trim()
    
    if (!userMessage || !canGenerate || loading) {
      if (!canGenerate) {
        setShowLimitModal(true)
      }
      return
    }

    setMessage('')
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    // Add loading message
    const loadingMessage = mode === 'sermon' 
      ? 'Preparing your sermon... This usually takes 10-15 seconds.'
      : 'Preparing your Bible study... This usually takes 10-15 seconds.'
    setMessages(prev => [...prev, { role: 'assistant', content: loadingMessage, loading: true }])

    // Use the hook to generate with options (spec requirements only)
    try {
      const options = mode === 'sermon' ? {
        audience,
        teachingStyle,
        culturalContext,
        tone,
        length
      } : {}
      
      await generate(userMessage, mode, options)
    } catch (err) {
      console.error('Generate error:', err)
    }
  }

  // Update messages when output or error changes
  useEffect(() => {
    if (output && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.loading) {
        // Parse sermon sections if it's a sermon
        const parsedSections = mode === 'sermon' ? parseSermonSections(output) : null
        const originalInputs = {
          topic: messages.find(m => m.role === 'user')?.content || '',
          verse: '', // Could extract from output if needed
          audience,
          teachingStyle,
          culturalContext,
          tone,
          length
        }
        
        setMessages(prev => {
          const updated = prev.slice(0, -1)
          return [...updated, { 
            role: 'assistant', 
            content: output,
            id: Date.now(), // Add ID for copy functionality
            sections: parsedSections, // Store parsed sections
            originalInputs, // Store original inputs for regeneration
            mode // Store mode for regeneration
          }]
        })
      }
    }
  }, [output, mode, audience, teachingStyle, culturalContext, tone, length])

  useEffect(() => {
    if (error && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.loading) {
        setMessages(prev => {
          const updated = prev.slice(0, -1)
          return [...updated, { 
            role: 'assistant', 
            content: `Error: ${error}`, 
            error: true 
          }]
        })
      }
    }
  }, [error])

  const handleCopy = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Load saved content on mount
  useEffect(() => {
    const loadSavedContent = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const response = await fetch('/api/save-content', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setSavedContent(result.data || [])
          }
        }
      } catch (err) {
        console.error('Failed to load saved content:', err)
      }
    }
    loadSavedContent()
  }, [])

  // Save content
  const handleSave = async (content, messageId) => {
    try {
      setSavingId(messageId)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please sign in to save content')
        return
      }

      const message = messages.find(m => m.id === messageId)
      
      // Extract title from content (first line or first 50 chars)
      const title = content.split('\n')[0].substring(0, 50) || `Saved ${mode === 'sermon' ? 'Sermon' : 'Bible Study'}`

      // Store structured data if available
      const structuredData = message?.sections ? {
        sections: message.sections,
        originalInputs: message.originalInputs
      } : null

      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title,
          content,
          content_type: mode,
          topic: messages.find(m => m.role === 'user' && m.content)?.content || '',
          bible_verse: '',
          style: tone,
          structured_data: structuredData ? JSON.stringify(structuredData) : null
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSavedContent(prev => [result.data, ...prev])
          // Update message to show it's saved
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, saved: true, savedId: result.data.id } : msg
          ))
        }
      }
    } catch (err) {
      console.error('Failed to save:', err)
      alert('Failed to save content. Please try again.')
    } finally {
      setSavingId(null)
    }
  }

  // Edit content
  const handleEdit = (messageId, content) => {
    setEditingId(messageId)
    setEditContent(content)
  }

  const handleSaveEdit = async (messageId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const message = messages.find(m => m.id === messageId)
      if (!message || !message.savedId) {
        // If not saved, just update the message
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, content: editContent } : msg
        ))
        setEditingId(null)
        return
      }

      // Update saved content
      const response = await fetch('/api/save-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          id: message.savedId,
          content: editContent
        })
      })

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, content: editContent } : msg
        ))
        setSavedContent(prev => prev.map(item => 
          item.id === message.savedId ? { ...item, content: editContent } : item
        ))
        setEditingId(null)
      }
    } catch (err) {
      console.error('Failed to save edit:', err)
      alert('Failed to save changes. Please try again.')
    }
  }

  // Regenerate content
  // Regenerate content (full or section-based)
  const handleRegenerate = async (messageId, section = null) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    // If section is provided, show modal for section regeneration
    if (section && message.sections) {
      setRegeneratingSection({ messageId, section })
      setShowRegenerateModal(true)
      return
    }

    // Full regeneration - find the user message that prompted this
    const messageIndex = messages.findIndex(m => m.id === messageId)
    const userMessage = messages[messageIndex - 1]?.content

    if (!userMessage) return

    // Remove the old assistant message and regenerate
    setMessages(prev => prev.filter(m => m.id !== messageId))
    await handleGenerate(userMessage)
  }

  // Regenerate a specific section
  const handleRegenerateSection = async () => {
    if (!regeneratingSection) return

    const { messageId, section } = regeneratingSection
    const message = messages.find(m => m.id === messageId)
    if (!message || !message.originalInputs) return

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please sign in to regenerate content')
        return
      }

      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          section,
          originalSermon: message.content,
          originalInputs: message.originalInputs,
          additionalNote: regenerateNote.trim() || undefined
        }),
        cache: 'no-store',
        next: { revalidate: 0 }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to regenerate section')
      }

      const data = await response.json()
      
      if (data.success && data.content) {
        // Parse the regenerated content
        const parsedSections = mode === 'sermon' ? parseSermonSections(data.content) : null
        
        // Update the message with regenerated content
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { 
                ...msg, 
                content: data.content,
                sections: parsedSections
              }
            : msg
        ))
        
        setShowRegenerateModal(false)
        setRegeneratingSection(null)
        setRegenerateNote('')
      }
    } catch (err) {
      console.error('Regeneration error:', err)
      alert(err.message || 'Failed to regenerate section. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Delete from library
  const handleDeleteFromLibrary = async (contentId) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/save-content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ id: contentId })
      })

      if (response.ok) {
        setSavedContent(prev => prev.filter(item => item.id !== contentId))
      }
    } catch (err) {
      console.error('Failed to delete:', err)
      alert('Failed to delete content. Please try again.')
    }
  }

  // Load content from library into chat
  const handleLoadFromLibrary = (content) => {
    setMode(content.content_type)
    setMessages([
      { role: 'user', content: content.topic || 'Loaded from library' },
      { role: 'assistant', content: content.content, id: Date.now(), saved: true, savedId: content.id }
    ])
    setShowLibrary(false)
  }

  // Edit library content
  const handleEditLibrary = (content) => {
    setEditingLibraryId(content.id)
    setEditLibraryContent(content.content)
  }

  const handleSaveLibraryEdit = async (contentId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/save-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          id: contentId,
          content: editLibraryContent
        })
      })

      if (response.ok) {
        setSavedContent(prev => prev.map(item => 
          item.id === contentId ? { ...item, content: editLibraryContent } : item
        ))
        setEditingLibraryId(null)
      }
    } catch (err) {
      console.error('Failed to save edit:', err)
      alert('Failed to save changes. Please try again.')
    }
  }

  // Filter library content
  const filteredLibrary = libraryFilter === 'all' 
    ? savedContent 
    : savedContent.filter(item => item.content_type === libraryFilter)

  // Format content for better readability
  const formatContent = (content) => {
    if (!content) return content
    
    // Split by common markdown headers
    const lines = content.split('\n')
    const formatted = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check for headers (# ## ###)
      if (line.match(/^#{1,3}\s/)) {
        const level = line.match(/^#+/)[0].length
        const text = line.replace(/^#+\s/, '')
        formatted.push({ type: 'header', level, text, line })
      }
      // Check for bold (**text**)
      else if (line.match(/\*\*.*\*\*/)) {
        formatted.push({ type: 'bold', text: line, line })
      }
      // Check for numbered lists
      else if (line.match(/^\d+\.\s/)) {
        formatted.push({ type: 'list-item', text: line, line })
      }
      // Regular paragraph
      else if (line.trim()) {
        formatted.push({ type: 'paragraph', text: line, line })
      }
      // Empty line
      else {
        formatted.push({ type: 'empty', text: '', line })
      }
    }
    
    return formatted
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" suppressHydrationWarning>
      {/* Header */}
      <div className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-14 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground" suppressHydrationWarning>
                <span suppressHydrationWarning>
                  {mounted ? `Peace be with you, ${userName}.` : `Peace be with you.`}
                </span>
              </h2>
              <p className="text-muted-foreground mt-2 text-base">
                Describe the message God placed on your heart
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLibrary(!showLibrary)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  showLibrary
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-accent border border-border"
                )}
              >
                <Library className="w-4 h-4" />
                Library {savedContent.length > 0 && `(${savedContent.length})`}
              </button>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {isPro ? (
                    <span className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-4 h-4" />
                      Unlimited
                    </span>
                  ) : (
                    `${remaining} of ${FREE_TIER_LIMIT} left`
                  )}
                </div>
                {!isPro && (
                  <button
                    onClick={() => router.push('/pricing')}
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Library Sidebar */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowLibrary(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-background border-l border-border shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-full flex flex-col">
              {/* Library Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Your Library</h3>
                  <p className="text-sm text-muted-foreground mt-1">{savedContent.length} saved items</p>
                </div>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter */}
              <div className="px-6 py-3 border-b border-border flex gap-2">
                <button
                  onClick={() => setLibraryFilter('all')}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium transition-all",
                    libraryFilter === 'all'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-accent"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setLibraryFilter('sermon')}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium transition-all",
                    libraryFilter === 'sermon'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-accent"
                  )}
                >
                  Sermons
                </button>
                <button
                  onClick={() => setLibraryFilter('study')}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium transition-all",
                    libraryFilter === 'study'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-accent"
                  )}
                >
                  Bible Studies
                </button>
              </div>

              {/* Library Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredLibrary.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Library className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No saved content yet</p>
                    <p className="text-sm mt-2">Save your generated sermons and Bible studies to access them here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLibrary.map((item) => (
                      <div
                        key={item.id}
                        className="border border-border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="capitalize">{item.content_type}</span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleLoadFromLibrary(item)}
                              className="p-1.5 rounded hover:bg-accent text-muted-foreground"
                              title="Load into chat"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditLibrary(item)}
                              className="p-1.5 rounded hover:bg-accent text-muted-foreground"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFromLibrary(item.id)}
                              className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {editingLibraryId === item.id ? (
                          <div className="mt-3 space-y-2">
                            <textarea
                              value={editLibraryContent}
                              onChange={(e) => setEditLibraryContent(e.target.value)}
                              className="w-full min-h-[200px] p-2 rounded border border-border bg-background text-foreground text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveLibraryEdit(item.id)}
                                className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingLibraryId(null)}
                                className="px-3 py-1.5 bg-muted text-foreground rounded text-sm font-medium hover:bg-accent"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {item.content.substring(0, 150)}...
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 py-6">
        <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
          {/* Mode Selector - Simple & Centered */}
          <div className="mb-6 flex gap-3 justify-center">
            <button
              onClick={() => setMode('sermon')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium transition-all",
                mode === 'sermon'
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground border border-border"
              )}
            >
              <BookOpen className="w-5 h-5" />
              Sermon
            </button>
            <button
              onClick={() => setMode('study')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium transition-all",
                mode === 'study'
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground border border-border"
              )}
            >
              <FileText className="w-5 h-5" />
              Bible Study
            </button>
          </div>

          {/* Advanced Options - Collapsible */}
          {mode === 'sermon' && (
            <div className="mb-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Advanced Options</span>
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {showAdvanced && (
                <div className="mt-3 space-y-3 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Audience */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Audience</label>
                      <select
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="w-full px-3 py-1.5 rounded text-xs bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="youth">Youth</option>
                        <option value="adults">Adults</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>

                    {/* Teaching Style */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Teaching Style</label>
                      <select
                        value={teachingStyle}
                        onChange={(e) => setTeachingStyle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded text-xs bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="narrative">Narrative</option>
                        <option value="expository">Expository</option>
                        <option value="teaching">Teaching</option>
                      </select>
                    </div>

                    {/* Cultural Focus */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cultural Focus</label>
                      <select
                        value={culturalContext}
                        onChange={(e) => setCulturalContext(e.target.value)}
                        className="w-full px-3 py-1.5 rounded text-xs bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="global">Global</option>
                        <option value="african">African</option>
                        <option value="nigerian">Nigerian</option>
                      </select>
                    </div>

                    {/* Length */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Length</label>
                      <select
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full px-3 py-1.5 rounded text-xs bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="short">Short (10-12 min)</option>
                        <option value="medium">Medium (15-18 min)</option>
                        <option value="long">Long (20-25 min)</option>
                      </select>
                    </div>

                    {/* Tone */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tone</label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full px-3 py-1.5 rounded text-xs bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="encouraging">Encouraging</option>
                        <option value="corrective">Corrective</option>
                        <option value="prophetic">Prophetic</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 min-h-0">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <div className="text-center text-muted-foreground max-w-md">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium mb-2">You understand the Bible</p>
                  <p className="text-sm">
                    Share what's on your heart, and I'll help you structure it, apply it, and communicate it clearly to your people.
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 relative group",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : msg.error
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-muted text-foreground border border-border shadow-sm"
                  )}
                >
                  {msg.loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{msg.content}</span>
                    </div>
                  ) : msg.error ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                  ) : msg.role === 'assistant' && msg.id ? (
                    <div>
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingId === msg.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(msg.id)}
                              className="p-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground"
                              title="Save changes"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-md bg-muted hover:bg-muted/80 text-foreground"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleCopy(msg.content, msg.id)}
                              className="p-1.5 rounded-md bg-background/80 hover:bg-background border border-border"
                              title="Copy content"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-4 h-4 text-primary" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                            {!msg.saved && (
                              <button
                                onClick={() => handleSave(msg.content, msg.id)}
                                disabled={savingId === msg.id}
                                className="p-1.5 rounded-md bg-background/80 hover:bg-background border border-border"
                                title="Save to library"
                              >
                                {savingId === msg.id ? (
                                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(msg.id, msg.content)}
                              className="p-1.5 rounded-md bg-background/80 hover:bg-background border border-border"
                              title="Edit content"
                            >
                              <Edit2 className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleRegenerate(msg.id)}
                              disabled={loading}
                              className="p-1.5 rounded-md bg-background/80 hover:bg-background border border-border"
                              title="Regenerate entire sermon"
                            >
                              <RefreshCw className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Formatted Content - Show sections if available (sermons only) */}
                      <div className="prose prose-sm dark:prose-invert max-w-none pr-8">
                        {editingId === msg.id ? (
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full min-h-[200px] p-2 rounded border border-border bg-background text-foreground text-sm"
                          />
                        ) : msg.sections && mode === 'sermon' ? (
                          // Render sections with individual regenerate buttons
                          <div className="space-y-4">
                            {msg.sections.title && (
                              <div>
                                <h1 className="text-xl font-bold mb-2">{msg.sections.title}</h1>
                              </div>
                            )}
                            {msg.sections.primary_scripture && (
                              <div className="border-l-2 border-primary pl-3">
                                <h2 className="font-semibold mb-1">PRIMARY SCRIPTURE</h2>
                                <p className="text-sm">{msg.sections.primary_scripture}</p>
                              </div>
                            )}
                            {msg.sections.introduction && (
                              <div className="border-l-2 border-blue-500 pl-3 relative group/section">
                                <div className="absolute top-0 right-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleRegenerate(msg.id, 'introduction')}
                                    className="p-1 rounded text-xs bg-background/80 hover:bg-background border border-border"
                                    title="Regenerate Introduction"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                </div>
                                <h2 className="font-semibold mb-1">INTRODUCTION</h2>
                                <p className="text-sm whitespace-pre-wrap">{msg.sections.introduction}</p>
                              </div>
                            )}
                            {msg.sections.biblical_context && (
                              <div className="border-l-2 border-green-500 pl-3">
                                <h2 className="font-semibold mb-1">BIBLICAL CONTEXT</h2>
                                <p className="text-sm whitespace-pre-wrap">{msg.sections.biblical_context}</p>
                              </div>
                            )}
                            {msg.sections.exegetical_insights && (
                              <div className="border-l-2 border-purple-500 pl-3">
                                <h2 className="font-semibold mb-1">EXEGETICAL INSIGHTS</h2>
                                <p className="text-sm whitespace-pre-wrap">{msg.sections.exegetical_insights}</p>
                              </div>
                            )}
                            {msg.sections.points && msg.sections.points.length > 0 && (
                              <div className="border-l-2 border-orange-500 pl-3 relative group/section">
                                <div className="absolute top-0 right-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleRegenerate(msg.id, 'illustrations')}
                                    className="p-1 rounded text-xs bg-background/80 hover:bg-background border border-border"
                                    title="Regenerate Illustrations"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                </div>
                                <h2 className="font-semibold mb-2">SERMON POINTS</h2>
                                {msg.sections.points.map((point, idx) => (
                                  <div key={idx} className="mb-3">
                                    <h3 className="font-medium mb-1">Point {idx + 1}: {point.title}</h3>
                                    <p className="text-sm whitespace-pre-wrap">{point.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            {msg.sections.application && (
                              <div className="border-l-2 border-red-500 pl-3 relative group/section">
                                <div className="absolute top-0 right-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleRegenerate(msg.id, 'application')}
                                    className="p-1 rounded text-xs bg-background/80 hover:bg-background border border-border"
                                    title="Regenerate Application"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                </div>
                                <h2 className="font-semibold mb-1">PRACTICAL APPLICATION</h2>
                                <p className="text-sm whitespace-pre-wrap">{msg.sections.application}</p>
                              </div>
                            )}
                            {msg.sections.conclusion && (
                              <div className="border-l-2 border-indigo-500 pl-3">
                                <h2 className="font-semibold mb-1">CONCLUSION</h2>
                                <p className="text-sm whitespace-pre-wrap">{msg.sections.conclusion}</p>
                              </div>
                            )}
                            {msg.sections.closing_prayer && (
                              <div className="border-l-2 border-pink-500 pl-3">
                                <h2 className="font-semibold mb-1">CLOSING PRAYER</h2>
                                <p className="text-sm whitespace-pre-wrap">{msg.sections.closing_prayer}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {msg.content}
                          </div>
                        )}
                      </div>
                      {msg.saved && (
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Saved to library
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="w-full">
            <div className="space-y-2">
              <ChatInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onSubmit={handleGenerate}
                loading={loading}
                onStop={() => setLoading(false)}
                className="bg-background border-border"
              >
                <ChatInputTextArea
                  placeholder={
                    mode === 'sermon'
                      ? "What burden has God placed on your heart? I'll help you structure it, apply it, and communicate it clearly..."
                      : "What Bible passage or topic do you want to teach? I'll help you structure it, apply it, and communicate it clearly..."
                  }
                  disabled={!canGenerate || loading}
                />
                <ChatInputSubmit />
              </ChatInput>
              <button
                onClick={() => handleGenerate(message)}
                disabled={!message.trim() || !canGenerate || loading}
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg font-medium transition-all",
                  !message.trim() || !canGenerate || loading
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "Generate Message"
                )}
              </button>
            </div>
            
            {/* Trust Disclaimer */}
            <p className="text-xs text-muted-foreground mt-3 text-center">
              This tool assists pastors — it does not replace prayer or discernment.
            </p>
          </div>
        </div>
      </div>

      {/* Limit Modal */}
      <LimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />

      {/* Regenerate Section Modal */}
      {showRegenerateModal && regeneratingSection && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Regenerate Section</h3>
              <button
                onClick={() => {
                  setShowRegenerateModal(false)
                  setRegeneratingSection(null)
                  setRegenerateNote('')
                }}
                className="p-1 rounded hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Section to Regenerate
                </label>
                <div className="p-3 bg-muted rounded text-sm text-foreground capitalize">
                  {regeneratingSection.section === 'introduction' && 'Introduction'}
                  {regeneratingSection.section === 'illustrations' && 'Illustrations'}
                  {regeneratingSection.section === 'application' && 'Practical Application'}
                  {regeneratingSection.section === 'points' && 'Sermon Points'}
                  {regeneratingSection.section === 'full' && 'Entire Sermon'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Additional Instructions (Optional)
                </label>
                <textarea
                  value={regenerateNote}
                  onChange={(e) => setRegenerateNote(e.target.value)}
                  placeholder="e.g., 'Make this more practical for young adults' or 'Use more African examples'"
                  className="w-full min-h-[100px] p-3 rounded border border-border bg-background text-foreground text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRegenerateSection}
                  disabled={loading}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg font-medium transition-all",
                    loading
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Regenerating...
                    </span>
                  ) : (
                    'Regenerate'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRegenerateModal(false)
                    setRegeneratingSection(null)
                    setRegenerateNote('')
                  }}
                  className="px-4 py-2 rounded-lg font-medium bg-muted text-foreground hover:bg-accent transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
