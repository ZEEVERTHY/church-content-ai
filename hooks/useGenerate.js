'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { notifyUsageUpdate } from '@/lib/usageContext'

export function useGenerate() {
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const generate = async (input, mode, options = {}) => {
    if (!input || !input.trim()) {
      setError('Please enter a topic or description')
      return
    }

    if (!mode || !['sermon', 'study'].includes(mode)) {
      setError('Invalid mode. Must be "sermon" or "study"')
      return
    }

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        
        // Handle refresh token errors specifically
        if (sessionError.message?.includes('Refresh Token') || 
            sessionError.message?.includes('refresh_token') ||
            sessionError.status === 401) {
          // Clear invalid tokens
          if (typeof window !== 'undefined') {
            try {
              Object.keys(localStorage).forEach(key => {
                if (key.includes('supabase') || key.includes('sb-')) {
                  localStorage.removeItem(key)
                }
              })
            } catch (e) {
              console.error('Error clearing storage:', e)
            }
          }
          
          setError('Your session has expired. Please sign in again.')
          
          // Redirect to auth after a short delay
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/auth'
            }
          }, 2000)
          
          setLoading(false)
          return
        }
        
        setError('Authentication error. Please try logging in again.')
        setLoading(false)
        return
      }
      
      if (!session || !session.access_token) {
        setError('You must be logged in to generate content')
        setLoading(false)
        return
      }

      console.log('Calling /api/generate with:', { input: input.trim(), mode, options })
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          input: input.trim(), 
          mode,
          ...(mode === 'sermon' && options ? { sermonOptions: options } : {})
        }),
        cache: 'no-store', // Prevent Next.js from caching API calls
        next: { revalidate: 0 } // Force revalidation on every request
      })

      console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = 'Failed to generate content'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.content) {
        throw new Error('No content received from server')
      }

      setOutput(data.content)
      notifyUsageUpdate()
    } catch (err) {
      console.error('Generation error:', err)
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
      
      // Handle network errors specifically
      if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message === 'Failed to fetch')) {
        setError('Network error: Please check your internet connection and try again. If the problem persists, the server may be down.')
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Failed to generate content. Please try again.')
      }
      setOutput('')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setOutput('')
    setError('')
    setLoading(false)
  }

  return { generate, loading, output, error, reset }
}
