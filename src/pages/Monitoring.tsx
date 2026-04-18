import { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { useData } from '../context/DataContext'
import { 
  Radio, 
  Plus, 
  Search, 
  Globe, 
  Twitter, 
  Rss,
  Trash2,
  Power,
  PowerOff,
  Hash,
  ExternalLink
} from 'lucide-react'

interface MonitoringSource {
  id: string
  name: string
  type: 'twitter' | 'rss' | 'web'
  url: string
  status: 'active' | 'paused' | 'error'
  lastCheck: string
  itemsFound: number
}

interface Keyword {
  id: string
  term: string
  category: string
  alertOnMatch: boolean
  matchCount: number
}

const mockSources: MonitoringSource[] = [
  { id: '1', name: 'Twitter Security Feed', type: 'twitter', url: '@securitynews', status: 'active', lastCheck: '2 min ago', itemsFound: 156 },
  { id: '2', name: 'CVE Database', type: 'rss', url: 'https://cve.mitre.org/feed', status: 'active', lastCheck: '5 min ago', itemsFound: 89 },
  { id: '3', name: 'Dark Web Monitor', type: 'web', url: 'https://monitor.darkweb', status: 'paused', lastCheck: '1 hour ago', itemsFound: 23 },
  { id: '4', name: 'Threat Intel RSS', type: 'rss', url: 'https://threatintel.io/rss', status: 'active', lastCheck: '1 min ago', itemsFound: 234 },
  { id: '5', name: 'OSINT Twitter List', type: 'twitter', url: '@osint_list', status: 'error', lastCheck: '30 min ago', itemsFound: 45 },
]

const mockKeywords: Keyword[] = [
  { id: '1', term: 'data breach', category: 'Security', alertOnMatch: true, matchCount: 45 },
  { id: '2', term: 'ransomware', category: 'Threats', alertOnMatch: true, matchCount: 23 },
  { id: '3', term: 'zero-day', category: 'Vulnerabilities', alertOnMatch: true, matchCount: 12 },
  { id: '4', term: 'phishing', category: 'Threats', alertOnMatch: false, matchCount: 67 },
  { id: '5', term: 'CVE-2024', category: 'Vulnerabilities', alertOnMatch: true, matchCount: 89 },
  { id: '6', term: 'malware', category: 'Threats', alertOnMatch: false, matchCount: 34 },
]

export const Monitoring = () => {
  const { isLoading } = useData()
  const [sources] = useState<MonitoringSource[]>(mockSources)
  const [keywords] = useState<Keyword[]>(mockKeywords)
  const [newKeyword, setNewKeyword] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'twitter':
        return <Twitter className="w-4 h-4" />
      case 'rss':
        return <Rss className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success border-success/30'
      case 'paused':
        return 'bg-warning/20 text-warning border-warning/30'
      case 'error':
        return 'bg-error/20 text-error border-error/30'
      default:
        return 'bg-foreground-secondary/20 text-foreground-secondary'
    }
  }

  const filteredKeywords = keywords.filter(k => 
    k.term.toLowerCase().includes(searchFilter.toLowerCase()) ||
    k.category.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Radio className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitoring</h1>
            <p className="text-foreground-secondary text-sm">Manage data sources and keywords</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-2xl font-bold text-foreground">{sources.length}</p>
            <p className="text-xs text-foreground-secondary">Total Sources</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-success">{sources.filter(s => s.status === 'active').length}</p>
            <p className="text-xs text-foreground-secondary">Active</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-accent">{keywords.length}</p>
            <p className="text-xs text-foreground-secondary">Keywords</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-warning">{keywords.filter(k => k.alertOnMatch).length}</p>
            <p className="text-xs text-foreground-secondary">Alert Rules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Sources */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                Data Sources
              </h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Add Source
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {sources.map((source) => (
                <div 
                  key={source.id}
                  className="p-3 border border-border rounded-lg hover:bg-background-tertiary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-background-tertiary">
                        {getSourceIcon(source.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{source.name}</h3>
                        <p className="text-xs text-foreground-secondary flex items-center gap-1 mt-0.5">
                          <ExternalLink className="w-3 h-3" />
                          {source.url}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-foreground-secondary">
                          <span>Last: {source.lastCheck}</span>
                          <span>Items: {source.itemsFound}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(source.status)}`}>
                        {source.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-foreground-secondary hover:text-warning transition-colors" title="Toggle">
                          {source.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button className="p-1 text-foreground-secondary hover:text-error transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Hash className="w-5 h-5 text-accent" />
                Keywords
              </h2>
            </div>

            {/* Add Keyword */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add new keyword..."
                  className="w-full pl-10 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <button className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter keywords..."
                className="w-full pl-10 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
              {filteredKeywords.map((keyword) => (
                <div 
                  key={keyword.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-background-tertiary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-accent/10 text-accent text-sm font-medium rounded">
                      {keyword.term}
                    </span>
                    <span className="text-xs text-foreground-secondary px-2 py-0.5 bg-background-tertiary rounded">
                      {keyword.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground-secondary">{keyword.matchCount} matches</span>
                    {keyword.alertOnMatch && (
                      <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs rounded border border-warning/30">
                        Alert
                      </span>
                    )}
                    <button className="p-1 text-foreground-secondary hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="card">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-accent" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {[
              { time: '2 min ago', action: 'New match found', detail: 'Keyword "data breach" matched in Twitter Security Feed', type: 'match' },
              { time: '5 min ago', action: 'Source updated', detail: 'CVE Database fetched 12 new items', type: 'update' },
              { time: '15 min ago', action: 'Alert triggered', detail: 'Critical match for "zero-day" vulnerability', type: 'alert' },
              { time: '30 min ago', action: 'Source error', detail: 'OSINT Twitter List connection failed', type: 'error' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'alert' ? 'bg-error' :
                  activity.type === 'error' ? 'bg-warning' :
                  activity.type === 'match' ? 'bg-accent' : 'bg-success'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground text-sm">{activity.action}</p>
                    <span className="text-xs text-foreground-secondary">{activity.time}</span>
                  </div>
                  <p className="text-sm text-foreground-secondary mt-0.5">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
