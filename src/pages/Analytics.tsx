import { Layout } from '../components/layout/Layout'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useData } from '../context/DataContext'
import { BarChart3, TrendingUp, TrendingDown, Minus, AlertCircle, Hash, Activity, Target } from 'lucide-react'

export const Analytics = () => {
  const { keywords, isLoading, error } = useData()

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-success'
      case 'down':
        return 'text-error'
      default:
        return 'text-foreground-secondary'
    }
  }

  // Pie chart data for trend distribution
  const trendData = [
    { name: 'Trending Up', value: keywords.filter(k => k.trend === 'up').length, color: '#10b981' },
    { name: 'Stable', value: keywords.filter(k => k.trend === 'stable').length, color: '#64748b' },
    { name: 'Trending Down', value: keywords.filter(k => k.trend === 'down').length, color: '#ef4444' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <BarChart3 className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-foreground-secondary text-sm">Comprehensive intelligence analysis and trends</p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Hash className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{keywords.length}</p>
                <p className="text-xs text-foreground-secondary">Total Keywords</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{keywords.filter(k => k.trend === 'up').length}</p>
                <p className="text-xs text-foreground-secondary">Trending Up</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Target className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{keywords[0]?.frequency || 0}</p>
                <p className="text-xs text-foreground-secondary">Top Frequency</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-light/10">
                <Activity className="w-5 h-5 text-accent-light" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-light">
                  {keywords.reduce((sum, k) => sum + k.frequency, 0)}
                </p>
                <p className="text-xs text-foreground-secondary">Total Mentions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keyword Frequency Chart */}
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-bold text-foreground mb-4">Keyword Frequency Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={keywords}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="keyword" stroke="#cbd5e1" fontSize={12} />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="frequency" fill="#3b82f6" name="Frequency" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Distribution Pie Chart */}
          <div className="card">
            <h2 className="text-lg font-bold text-foreground mb-4">Trend Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={trendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {trendData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-foreground-secondary">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keyword Trends Table */}
        <div className="card">
          <h2 className="text-lg font-bold text-foreground mb-4">Top Keywords & Trends</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Keyword</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Frequency</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Trend</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((keyword, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-background-tertiary transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground px-2 py-1 bg-accent/10 rounded">
                        {keyword.keyword}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">{keyword.frequency}</td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center gap-2 ${getTrendColor(keyword.trend)}`}>
                        {getTrendIcon(keyword.trend)}
                        <span className="capitalize">{keyword.trend}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-success/20 text-success rounded font-medium text-sm border border-success/30">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
