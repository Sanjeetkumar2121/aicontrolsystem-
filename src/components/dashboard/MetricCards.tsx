import { DashboardMetrics } from '../../types/index'
import { 
  AlertTriangle, 
  Zap, 
  Target, 
  Radio, 
  TrendingUp, 
  Activity 
} from 'lucide-react'

interface MetricCardsProps {
  metrics: DashboardMetrics
}

export const MetricCards = ({ metrics }: MetricCardsProps) => {
  const cards = [
    {
      label: 'Total Alerts',
      value: metrics.totalAlerts,
      icon: AlertTriangle,
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
    },
    {
      label: 'Active Alerts',
      value: metrics.activeAlerts,
      icon: Zap,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
    },
    {
      label: 'Monitored Keywords',
      value: metrics.monitoredKeywords,
      icon: Target,
      color: 'text-accent-light',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    {
      label: 'Active Feeds',
      value: metrics.activeFeeds,
      icon: Radio,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    {
      label: 'Sentiment Score',
      value: metrics.sentimentScore.toFixed(1),
      icon: Activity,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    {
      label: 'Trending Topics',
      value: metrics.trendsCount,
      icon: TrendingUp,
      color: 'text-accent-light',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div 
            key={index} 
            className={`metric-card group hover:scale-[1.02] transition-all duration-200 ${card.borderColor} border`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-foreground-secondary text-sm mb-2">{card.label}</p>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
