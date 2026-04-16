import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { DataContextType, OsintFeed, Alert, DashboardMetrics, KeywordFrequency, SentimentData, TrendData } from '../types/index'
import { api } from '../services/api'

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feeds, setFeeds] = useState<OsintFeed[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAlerts: 0,
    activeAlerts: 0,
    monitoredKeywords: 0,
    activeFeeds: 0,
    sentimentScore: 0,
    trendsCount: 0,
  })
  const [keywords, setKeywords] = useState<KeywordFrequency[]>([])
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [feedsData, alertsData, metricsData, keywordsData, sentimentDataResult, trendDataResult] = await Promise.all([
        api.getFeeds(),
        api.getAlerts(),
        api.getMetrics(),
        api.getKeywords(),
        api.getSentimentData(),
        api.getTrendData(),
      ])

      setFeeds(feedsData)
      setAlerts(alertsData)
      setMetrics(metricsData)
      setKeywords(keywordsData)
      setSentimentData(sentimentDataResult)
      setTrendData(trendDataResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    refetchData()
  }, [refetchData])

  // Simulate real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchData()
    }, 30000)

    return () => clearInterval(interval)
  }, [refetchData])

  const value: DataContextType = {
    feeds,
    alerts,
    metrics,
    keywords,
    sentimentData,
    trendData,
    isLoading,
    error,
    refetchData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
