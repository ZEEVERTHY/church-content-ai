'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      const info = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
        supabaseUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKeyValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'Not set',
        userAgent: navigator.userAgent,
        location: window.location.href
      }

      // Test Supabase connection
      try {
        const { data, error } = await supabase.auth.getSession()
        info.supabaseConnection = error ? `Error: ${error.message}` : 'Connected'
        info.currentSession = data?.session ? 'Active' : 'None'
        info.userId = data?.session?.user?.id || 'No user'
      } catch (error) {
        info.supabaseConnection = `Connection Error: ${error.message}`
      }

      // Test database connection
      try {
        const { data, error } = await supabase
          .from('user_usage')
          .select('count')
          .limit(1)
        info.databaseConnection = error ? `Error: ${error.message}` : 'Connected'
      } catch (error) {
        info.databaseConnection = `Database Error: ${error.message}`
      }

      setDebugInfo(info)
      setLoading(false)
    }

    runDiagnostics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Running diagnostics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment & Configuration</h2>
          <div className="space-y-2">
            {Object.entries(debugInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="text-gray-900 font-mono text-sm break-all">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Tests</h2>
          <div className="space-y-4">
            <button
              onClick={async () => {
                try {
                  const { data, error } = await supabase.auth.getSession()
                  alert(error ? `Error: ${error.message}` : `Session: ${data?.session ? 'Active' : 'None'}`)
                } catch (error) {
                  alert(`Error: ${error.message}`)
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Test Auth Session
            </button>
            
            <button
              onClick={async () => {
                try {
                  const { data, error } = await supabase
                    .from('user_usage')
                    .select('count')
                    .limit(1)
                  alert(error ? `Error: ${error.message}` : 'Database connected')
                } catch (error) {
                  alert(`Error: ${error.message}`)
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-4"
            >
              Test Database
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
