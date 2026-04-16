import React from 'react'
import { Layout } from '../components/layout/Layout'
import { MetricCards } from '../components/dashboard/MetricCards'
import { LiveFeed } from '../components/dashboard/LiveFeed'
import { SentimentChart } from '../components/dashboard/SentimentChart'
import { TrendChart } from '../components/dashboard/TrendChart'
import { useData } from '../context/DataContext'

export const Dashboard: React.FC = () => {
  const { metrics, feeds, sentimentData, trendData, isLoading, error, refetchData } = useData()

  if (error) {
    return (
      <Layout>
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <span>📊</span> Dashboard
            </h1>
            <p className="text-foreground-secondary mt-1">Real-time OSINT monitoring and analysis</p>
          </div>
          <button
            onClick={refetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading && (
          <div className="p-3 bg-accent/10 border border-accent text-accent rounded-lg text-sm flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Updating data...
          </div>
        )}

        {/* Metrics */}
        <MetricCards metrics={metrics} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentimentChart data={sentimentData} />
          <TrendChart data={trendData} />
        </div>

        {/* Live Feed */}
        <LiveFeed feeds={feeds} />
      </div>
    </Layout>
  )
}
