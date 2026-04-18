import { useState } from 'react'
import { OsintFeed } from '../../types/index'
import { Radio, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface LiveFeedProps {
  feeds: OsintFeed[]
}

export const LiveFeed = ({ feeds }: LiveFeedProps) => {
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
        return 'bg-success/10 border-success/20'
      case 'negative':
        return 'bg-error/10 border-error/20'
      default:
        return 'bg-foreground-secondary/10 border-foreground-secondary/20'
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Radio className="w-5 h-5 text-accent" />
          Live Intelligence Feed
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-xs text-success font-medium">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="border border-border rounded-lg p-4 hover:bg-background-tertiary/50 transition-all cursor-pointer group"
            onClick={() => setExpandedId(expandedId === feed.id ? null : feed.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-foreground line-clamp-2 flex-1">{feed.title}</h3>
                  {expandedId === feed.id ? (
                    <ChevronUp className="w-4 h-4 text-foreground-secondary flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-foreground-secondary flex-shrink-0 mt-1" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-accent font-medium">{feed.source}</span>
                  <span className="text-foreground-secondary">·</span>
                  <span className="text-foreground-secondary">{formatTime(feed.timestamp)}</span>
                </div>

                {expandedId === feed.id && (
                  <div className="mt-3 space-y-3">
                    <p className="text-foreground-secondary text-sm leading-relaxed">{feed.content}</p>
                    <button className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      View Source
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 items-center mt-3">
                  {feed.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-background text-accent-light text-xs rounded border border-border hover:border-accent/50 transition-colors"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className={`flex-shrink-0 px-3 py-2 rounded-lg border ${getSentimentBg(feed.sentiment)}`}>
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
