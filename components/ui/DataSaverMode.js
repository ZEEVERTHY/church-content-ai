'use client'
import { useState, useEffect, createContext, useContext } from 'react'

const DataSaverContext = createContext()

export const useDataSaver = () => {
  const context = useContext(DataSaverContext)
  if (!context) {
    throw new Error('useDataSaver must be used within a DataSaverProvider')
  }
  return context
}

export const DataSaverProvider = ({ children }) => {
  const [isDataSaverEnabled, setIsDataSaverEnabled] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState('unknown')

  useEffect(() => {
    // Check for saved preference
    const saved = localStorage.getItem('dataSaverEnabled')
    if (saved !== null) {
      setIsDataSaverEnabled(JSON.parse(saved))
    }

    // Detect connection speed
    if ('connection' in navigator) {
      const connection = navigator.connection
      setConnectionSpeed(connection.effectiveType || 'unknown')
      
      // Auto-enable data saver for slow connections
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        setIsDataSaverEnabled(true)
        localStorage.setItem('dataSaverEnabled', 'true')
      }
    }
  }, [])

  const toggleDataSaver = () => {
    const newValue = !isDataSaverEnabled
    setIsDataSaverEnabled(newValue)
    localStorage.setItem('dataSaverEnabled', JSON.stringify(newValue))
  }

  return (
    <DataSaverContext.Provider value={{
      isDataSaverEnabled,
      toggleDataSaver,
      connectionSpeed,
      shouldReduceImages: isDataSaverEnabled,
      shouldReduceAnimations: isDataSaverEnabled,
      shouldReduceFonts: isDataSaverEnabled,
    }}>
      {children}
    </DataSaverContext.Provider>
  )
}

export const DataSaverToggle = () => {
  const { isDataSaverEnabled, toggleDataSaver, connectionSpeed } = useDataSaver()

  return (
    <div className="flex items-center space-x-2 text-sm">
      <button
        onClick={toggleDataSaver}
        className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
          isDataSaverEnabled 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}
        title={`Data Saver ${isDataSaverEnabled ? 'Enabled' : 'Disabled'} - Connection: ${connectionSpeed}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Data Saver</span>
        {isDataSaverEnabled && (
          <span className="text-xs">ON</span>
        )}
      </button>
    </div>
  )
}

export default DataSaverProvider



