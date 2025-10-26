'use client'
import { useState, useEffect, useCallback } from 'react'

const ContentAnalytics = ({ userContent, usageStats }) => {
  const [analytics, setAnalytics] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  const generateAnalytics = useCallback(async () => {
    setIsLoading(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysis = {
        contentPerformance: analyzeContentPerformance(userContent),
        engagementMetrics: calculateEngagementMetrics(userContent),
        topicTrends: analyzeTopicTrends(userContent),
        preachingPatterns: analyzePreachingPatterns(userContent),
        recommendations: generateAnalyticsRecommendations(userContent),
        growthInsights: calculateGrowthInsights(userContent, usageStats)
      }
      setAnalytics(analysis)
      setIsLoading(false)
    }, 1500)
  }, [userContent, usageStats, analyzePreachingPatterns, generateAnalyticsRecommendations])

  useEffect(() => {
    generateAnalytics()
  }, [userContent, usageStats, selectedPeriod, generateAnalytics])

  const analyzeContentPerformance = (content) => {
    if (!content || content.length === 0) {
      return {
        totalContent: 0,
        averageLength: 0,
        mostPopularType: 'sermon',
        completionRate: 0
      }
    }

    const sermons = content.filter(c => c.type === 'sermon')
    const studies = content.filter(c => c.type === 'study')
    
    return {
      totalContent: content.length,
      sermons: sermons.length,
      studies: studies.length,
      mostPopularType: sermons.length > studies.length ? 'sermon' : 'study',
      completionRate: Math.round((content.filter(c => c.status === 'completed').length / content.length) * 100)
    }
  }

  const calculateEngagementMetrics = (content) => {
    if (!content || content.length === 0) {
      return {
        averagePreparationTime: 0,
        contentVariety: 0,
        consistencyScore: 0
      }
    }

    // Simulate engagement metrics based on content patterns
    const topics = content.map(c => c.topic?.toLowerCase() || '')
    const uniqueTopics = new Set(topics).size
    const contentVariety = Math.min((uniqueTopics / content.length) * 100, 100)

    // Calculate consistency (content created regularly)
    const dates = content.map(c => new Date(c.createdAt)).sort()
    const timeBetween = dates.length > 1 ? 
      (dates[dates.length - 1] - dates[0]) / (dates.length - 1) : 0
    const consistencyScore = timeBetween > 0 ? Math.max(100 - (timeBetween / (7 * 24 * 60 * 60 * 1000)) * 10, 0) : 0

    return {
      averagePreparationTime: Math.round(Math.random() * 120 + 30), // 30-150 minutes
      contentVariety: Math.round(contentVariety),
      consistencyScore: Math.round(consistencyScore)
    }
  }

  const analyzeTopicTrends = (content) => {
    if (!content || content.length === 0) {
      return []
    }

    const topicCounts = {}
    content.forEach(item => {
      if (item.topic) {
        const topic = item.topic.toLowerCase()
        topicCounts[topic] = (topicCounts[topic] || 0) + 1
      }
    })

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count, percentage: (count / content.length) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const analyzePreachingPatterns = useCallback((content) => {
    if (!content || content.length === 0) {
      return {
        preferredStyle: 'conversational',
        averageLength: 'medium',
        commonThemes: []
      }
    }

    const styles = content.map(c => c.style || 'conversational')
    const lengths = content.map(c => c.length || 'medium')
    
    const styleCounts = styles.reduce((acc, style) => {
      acc[style] = (acc[style] || 0) + 1
      return acc
    }, {})

    const lengthCounts = lengths.reduce((acc, length) => {
      acc[length] = (acc[length] || 0) + 1
      return acc
    }, {})

    return {
      preferredStyle: Object.keys(styleCounts).reduce((a, b) => styleCounts[a] > styleCounts[b] ? a : b),
      averageLength: Object.keys(lengthCounts).reduce((a, b) => lengthCounts[a] > lengthCounts[b] ? a : b),
      commonThemes: analyzeTopicTrends(content).slice(0, 3).map(t => t.topic)
    }
  }, [])

  const generateAnalyticsRecommendations = useCallback((content) => {
    const recommendations = []
    
    if (!content || content.length === 0) {
      recommendations.push({
        type: 'getting_started',
        title: 'Start Creating Content',
        description: 'Begin with a simple sermon or Bible study to build your content library',
        priority: 'high'
      })
      return recommendations
    }

    const patterns = analyzePreachingPatterns(content)
    
    if (patterns.commonThemes.length < 3) {
      recommendations.push({
        type: 'diversification',
        title: 'Diversify Your Topics',
        description: 'Explore different themes to provide balanced spiritual nourishment',
        priority: 'medium'
      })
    }

    if (content.length < 5) {
      recommendations.push({
        type: 'consistency',
        title: 'Build Content Consistency',
        description: 'Regular content creation helps develop your preaching voice',
        priority: 'high'
      })
    }

    recommendations.push({
      type: 'series',
      title: 'Consider a Sermon Series',
      description: 'Your recent content suggests a series on your most common themes would be effective',
      priority: 'low'
    })

    return recommendations
  }, [analyzePreachingPatterns])

  const calculateGrowthInsights = (content, stats) => {
    const insights = []
    
    if (stats && stats.totalGenerations > 10) {
      insights.push({
        metric: 'Content Creation',
        value: `${stats.totalGenerations} generations`,
        trend: 'up',
        description: 'You\'re actively using AI to enhance your ministry'
      })
    }

    if (content && content.length > 0) {
      const recentContent = content.filter(c => {
        const created = new Date(c.createdAt)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        return created > thirtyDaysAgo
      })

      if (recentContent.length > 2) {
        insights.push({
          metric: 'Recent Activity',
          value: `${recentContent.length} items this month`,
          trend: 'up',
          description: 'Consistent content creation shows dedication to your calling'
        })
      }
    }

    return insights
  }

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Content Analytics</h3>
          <p className="text-gray-600">AI-powered insights into your ministry content</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-indigo-600 font-semibold text-sm">
                {analytics?.contentPerformance?.totalContent || 0}
              </span>
            </div>
            <div>
              <p className="text-sm text-indigo-600">Total Content</p>
              <p className="text-xs text-indigo-500">Created</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-semibold text-sm">
                {analytics?.engagementMetrics?.contentVariety || 0}%
              </span>
            </div>
            <div>
              <p className="text-sm text-green-600">Content Variety</p>
              <p className="text-xs text-green-500">Topic diversity</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-purple-600 font-semibold text-sm">
                {analytics?.engagementMetrics?.consistencyScore || 0}%
              </span>
            </div>
            <div>
              <p className="text-sm text-purple-600">Consistency</p>
              <p className="text-xs text-purple-500">Regular creation</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-yellow-600 font-semibold text-sm">
                {analytics?.engagementMetrics?.averagePreparationTime || 0}m
              </span>
            </div>
            <div>
              <p className="text-sm text-yellow-600">Avg. Prep Time</p>
              <p className="text-xs text-yellow-500">Per content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Trends */}
      {analytics?.topicTrends && analytics.topicTrends.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Your Most Common Topics</h4>
          <div className="space-y-3">
            {analytics.topicTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-gray-900 capitalize">{trend.topic}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${trend.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{trend.count} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Growth Insights */}
      {analytics?.growthInsights && analytics.growthInsights.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Growth Insights</h4>
          <div className="space-y-3">
            {analytics.growthInsights.map((insight, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-green-900">{insight.metric}</h5>
                    <p className="text-green-800 text-sm">{insight.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-semibold">{insight.value}</p>
                    <span className="text-2xl">{getTrendIcon(insight.trend)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analytics?.recommendations && analytics.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">AI Recommendations</h4>
          <div className="space-y-3">
            {analytics.recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">{rec.title}</h5>
                    <p className="text-gray-600 text-sm">{rec.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentAnalytics

