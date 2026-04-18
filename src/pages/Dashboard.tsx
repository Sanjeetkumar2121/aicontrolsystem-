import { Layout } from '../components/layout/Layout'
import { MetricCards } from '../components/dashboard/MetricCards'
import { LiveFeed } from '../components/dashboard/LiveFeed'
import { SentimentChart } from '../components/dashboard/SentimentChart'
import { TrendChart } from '../components/dashboard/TrendChart'
import { useData } from '../context/DataContext'
import { LayoutDashboard, RefreshCw, AlertCircle } from 'lucide-react'

export const Dashboard = () => {
  const { metrics, feeds, sentimentData, trendData, isLoading, error, refetchData } = useData()

  if (error) {
    return (
      <Layout>
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <LayoutDashboard className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-foreground-secondary text-sm">Real-time OSINT monitoring and analysis</p>
            </div>
          </div>
          <button
            onClick={refetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading && (
          <div className="p-3 bg-accent/10 border border-accent/30 text-accent rounded-lg text-sm flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
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
