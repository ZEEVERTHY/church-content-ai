'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthDebug() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const testConnection = async () => {
    setLoading(true)
    setMessage('Testing connection...')
    
    try {
      // Test if we can connect to Supabase
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setMessage(`Connection Error: ${error.message}`)
      } else {
        setMessage('✅ Connection successful! Supabase is working.')
      }
    } catch (error) {
      setMessage(`❌ Connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) {
        setMessage(`❌ Signup Error: ${error.message}`)
      } else {
        setMessage(`✅ Account created successfully! User ID: ${data.user?.id}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Supabase Debug</h1>
        
        {/* Connection Test */}
        <div className="mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {/* Environment Variables Check */}
        <div className="mb-6 p-4 bg-gray-100 rounded text-sm">
          <h3 className="font-semibold mb-2">Environment Check:</h3>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>

        {/* Test Signup */}
        <form onSubmit={testSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password123"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Test Signup'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/auth" className="text-blue-600 hover:text-blue-800">← Back to Auth</a>
        </div>
      </div>
    </div>
  )
}
