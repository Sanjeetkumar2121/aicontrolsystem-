import React, { useState } from 'react'
import { OsintFeed } from '../../types/index'

interface LiveFeedProps {
  feeds: OsintFeed[]
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ feeds }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success'
      case 'negative':
        return 'text-error'
      default:
        return 'text-foreground-secondary'
    }
  }

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10'
      case 'negative':
        return 'bg-red-500/10'
      default:
        return 'bg-slate-500/10'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <span>📡</span> Live Intelligence Feed
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="border border-border rounded-lg p-4 hover:bg-background-tertiary transition-colors cursor-pointer"
            onClick={() => setExpandedId(expandedId === feed.id ? null : feed.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{feed.title}</h3>
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <span className="text-foreground-secondary">{feed.source}</span>
                  <span className="text-foreground-secondary">•</span>
                  <span className="text-foreground-secondary">{formatTime(feed.timestamp)}</span>
                </div>

                {expandedId === feed.id && (
                  <p className="text-foreground-secondary text-sm mt-3 mb-3">{feed.content}</p>
                )}

                <div className="flex flex-wrap gap-2 items-center">
                  {feed.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-background text-accent-light text-xs rounded border border-border"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`flex-shrink-0 px-3 py-2 rounded ${getSentimentBg(feed.sentiment)}`}>
                <p className={`text-sm font-semibold ${getSentimentColor(feed.sentiment)}`}>
                  {feed.sentiment.charAt(0).toUpperCase() + feed.sentiment.slice(1)}
                </p>
                <p className="text-xs text-foreground-secondary">{feed.sentimentScore.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
