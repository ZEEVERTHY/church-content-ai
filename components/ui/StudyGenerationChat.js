'use client'

import { useState } from 'react'
import { BoltStyleChat } from './BoltStyleChat'

export function StudyGenerationChat({ 
  onGenerate, 
  loading = false,
  remainingCreations = 3 
}) {
  const handleSend = async (message) => {
    if (!message.trim()) return
    
    // Parse the message to extract topic, audience, duration
    const formData = {
      topic: message.trim(),
      targetAudience: 'adults', // Default, could be extracted or selected
      duration: '60' // Default 60 minutes
    }
    
    onGenerate?.(formData)
  }

  const isLimitReached = remainingCreations <= 0
  const placeholder = isLimitReached 
    ? "You've reached your limit. Upgrade to Premium for unlimited generations!"
    : "Describe your Bible study topic (e.g., 'The Fruit of the Spirit' or 'Walking in Faith')"

  return (
    <BoltStyleChat
      title="What Bible study will you"
      subtitle="Create engaging, structured Bible study guides with AI assistance"
      announcementText={isLimitReached ? "Upgrade to Premium" : "AI-Powered Bible Study Creation"}
      announcementHref={isLimitReached ? "/pricing" : "#"}
      placeholder={placeholder}
      onSend={handleSend}
      disabled={loading || isLimitReached}
      showAnnouncement={true}
      showImportButtons={false}
    />
  )
}
