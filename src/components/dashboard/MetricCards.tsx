import React from 'react'
import { DashboardMetrics } from '../../types/index'

interface MetricCardsProps {
  metrics: DashboardMetrics
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'Total Alerts',
      value: metrics.totalAlerts,
      icon: '🚨',
      color: 'text-error',
    },
    {
      label: 'Active Alerts',
      value: metrics.activeAlerts,
      icon: '⚡',
      color: 'text-warning',
    },
    {
      label: 'Monitored Keywords',
      value: metrics.monitoredKeywords,
      icon: '🎯',
      color: 'text-accent-light',
    },
    {
      label: 'Active Feeds',
      value: metrics.activeFeeds,
      icon: '📡',
      color: 'text-success',
    },
    {
      label: 'Sentiment Score',
      value: metrics.sentimentScore.toFixed(1),
      icon: '📊',
      color: 'text-accent',
    },
    {
      label: 'Trending Topics',
      value: metrics.trendsCount,
      icon: '📈',
      color: 'text-accent-light',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="metric-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm mb-2">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <span className="text-3xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
