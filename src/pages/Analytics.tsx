import React from 'react'
import { Layout } from '../components/layout/Layout'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '../context/DataContext'

export const Analytics: React.FC = () => {
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
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg">
          <p className="font-semibold">Error loading analytics</p>
          <p className="text-sm">{error}</p>
        </div>
      </Layout>
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      default:
        return '➡️'
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <span>📈</span> Analytics
          </h1>
          <p className="text-foreground-secondary mt-1">Comprehensive intelligence analysis and trends</p>
        </div>

        {/* Keyword Frequency Chart */}
        <div className="card">
          <h2 className="text-lg font-bold text-foreground mb-4">Keyword Frequency Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={keywords}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="keyword" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
              <Bar dataKey="frequency" fill="#3b82f6" name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
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
                    <td className="py-3 px-4 font-medium text-foreground">{keyword.keyword}</td>
                    <td className="py-3 px-4 text-foreground-secondary">{keyword.frequency}</td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center gap-2 ${getTrendColor(keyword.trend)}`}>
                        <span>{getTrendIcon(keyword.trend)}</span>
                        <span className="capitalize">{keyword.trend}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-accent/10 text-accent rounded font-medium text-sm">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <h3 className="text-foreground-secondary text-sm mb-2">Most Mentioned</h3>
            <p className="text-2xl font-bold text-accent">{keywords[0]?.keyword || 'N/A'}</p>
            <p className="text-foreground-secondary text-sm mt-1">{keywords[0]?.frequency || 0} mentions</p>
          </div>

          <div className="card text-center">
            <h3 className="text-foreground-secondary text-sm mb-2">Total Keywords</h3>
            <p className="text-2xl font-bold text-accent-light">{keywords.length}</p>
            <p className="text-foreground-secondary text-sm mt-1">Under monitoring</p>
          </div>

          <div className="card text-center">
            <h3 className="text-foreground-secondary text-sm mb-2">Trending Up</h3>
            <p className="text-2xl font-bold text-success">{keywords.filter(k => k.trend === 'up').length}</p>
            <p className="text-foreground-secondary text-sm mt-1">Keywords</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
