'use client'
import { useEffect, useState } from 'react'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    // Only run in development or for analytics
    if (process.env.NODE_ENV !== 'development') return

    const measurePerformance = () => {
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0]
      
      // Get resource timing
      const resources = performance.getEntriesByType('resource')
      
      // Calculate metrics
      const metrics = {
        // Page load time
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        
        // Time to first byte
        ttfb: navigation.responseStart - navigation.fetchStart,
        
        // DOM content loaded
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        
        // First contentful paint (if available)
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        
        // Largest contentful paint (if available)
        lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0,
        
        // Resource count and size
        resourceCount: resources.length,
        totalResourceSize: resources.reduce((total, resource) => {
          return total + (resource.transferSize || 0)
        }, 0),
        
        // Connection info
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
        } : null,
        
        // Memory usage (if available)
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
        } : null,
      }
      
      setMetrics(metrics)
      
      // Log to console in development
      console.log('🚀 Performance Metrics:', metrics)
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // Send metrics to your analytics service
        // analytics.track('performance_metrics', metrics)
      }
    }

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    // Monitor for LCP updates
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      setMetrics(prev => ({
        ...prev,
        lcp: lastEntry.startTime
      }))
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null
  }

  const getPerformanceGrade = (lcp) => {
    if (lcp < 2500) return { grade: 'A', color: 'text-green-600' }
    if (lcp < 4000) return { grade: 'B', color: 'text-yellow-600' }
    return { grade: 'C', color: 'text-red-600' }
  }

  const grade = getPerformanceGrade(metrics.lcp)

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-xs max-w-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Performance Monitor</h3>
        <span className={`font-bold ${grade.color}`}>{grade.grade}</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Page Load:</span>
          <span>{Math.round(metrics.pageLoadTime)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span>{Math.round(metrics.ttfb)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span>{Math.round(metrics.lcp)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Resources:</span>
          <span>{metrics.resourceCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Size:</span>
          <span>{Math.round(metrics.totalResourceSize / 1024)}KB</span>
        </div>
        {metrics.connection && (
          <div className="flex justify-between">
            <span>Connection:</span>
            <span>{metrics.connection.effectiveType}</span>
          </div>
        )}
        {metrics.memory && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>{metrics.memory.used}MB</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMonitor



