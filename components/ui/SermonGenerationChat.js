'use client'

import { useState } from 'react'
import { BoltStyleChat } from './BoltStyleChat'

export function SermonGenerationChat({ 
  onGenerate, 
  loading = false,
  remainingCreations = 3 
}) {
  const handleSend = async (message) => {
    if (!message.trim()) return
    
    // Parse the message to extract topic, verse, style, length
    // For now, we'll use the message as the topic and default values
    // You can enhance this with better parsing or a form
    const formData = {
      topic: message.trim(),
      verse: '', // Could be extracted from message
      style: 'conversational',
      length: 'medium'
    }
    
    onGenerate?.(formData)
  }

  const isLimitReached = remainingCreations <= 0
  const placeholder = isLimitReached 
    ? "You've reached your limit. Upgrade to Premium for unlimited generations!"
    : "Describe your sermon topic or theme (e.g., 'Faith in difficult times' or 'The power of prayer')"

  return (
    <BoltStyleChat
      title="What sermon will you"
      subtitle="Create inspiring, Biblically sound sermons with AI assistance"
      announcementText={isLimitReached ? "Upgrade to Premium" : "AI-Powered Sermon Generation"}
      announcementHref={isLimitReached ? "/pricing" : "#"}
      placeholder={placeholder}
      onSend={handleSend}
      disabled={loading || isLimitReached}
      showAnnouncement={true}
      showImportButtons={false}
    />
  )
}
