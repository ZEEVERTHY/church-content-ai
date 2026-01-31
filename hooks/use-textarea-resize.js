'use client'

import { useEffect, useRef, useCallback } from 'react'

export function useTextareaResize({
  minHeight = 48,
  maxHeight = 400,
}) {
  const textareaRef = useRef(null)

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto'
    
    // Calculate new height
    const newHeight = Math.max(
      minHeight,
      Math.min(
        textarea.scrollHeight,
        maxHeight
      )
    )

    textarea.style.height = `${newHeight}px`
  }, [minHeight, maxHeight])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Set initial height
      textarea.style.height = `${minHeight}px`
      // Adjust on input
      textarea.addEventListener('input', adjustHeight)
      // Initial adjustment
      adjustHeight()
    }
    
    return () => {
      if (textarea) {
        textarea.removeEventListener('input', adjustHeight)
      }
    }
  }, [adjustHeight, minHeight])

  return { textareaRef, adjustHeight }
}
