'use client'
import { useState } from 'react'

export default function TestStripePage() {
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testStripeConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-stripe')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1SGPB4POknuH8nO4cVGArikB' // Your actual price ID
        })
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Stripe Configuration Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testStripeConfig}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Stripe Configuration'}
          </button>
          
          <button
            onClick={testCheckout}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Checkout Creation'}
          </button>
        </div>

        {testResult && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Test Stripe Configuration" to check if your environment variables are loaded</li>
            <li>If the price ID is undefined, check your .env.local file</li>
            <li>Click "Test Checkout Creation" to test if Stripe can create a checkout session</li>
            <li>Make sure you have a valid Stripe Price ID in your .env.local file</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
