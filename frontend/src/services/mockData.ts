import { OsintFeed, Alert, KeywordFrequency, SentimentData, TrendData, DashboardMetrics } from '../types/index'

const mockFeeds: OsintFeed[] = [
  {
    id: '1',
    title: 'Critical vulnerability found in production system',
    content: 'A zero-day vulnerability has been discovered affecting multiple enterprise systems...',
    source: 'SecurityAlert',
    keywords: ['vulnerability', 'production', 'critical'],
    sentiment: 'negative',
    sentimentScore: 0.92,
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    relevanceScore: 0.95,
    url: '#'
  },
  {
    id: '2',
    title: 'Market sentiment shifts positive on tech stocks',
    content: 'Analysts report increased confidence in technology sector following strong earnings...',
    source: 'MarketNews',
    keywords: ['market', 'technology', 'investment'],
    sentiment: 'positive',
    sentimentScore: 0.78,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    relevanceScore: 0.82,
    url: '#'
  },
  {
    id: '3',
    title: 'New regulations impact data privacy landscape',
    content: 'European regulators announce new framework for data protection compliance...',
    source: 'Legal',
    keywords: ['regulation', 'privacy', 'compliance'],
    sentiment: 'neutral',
    sentimentScore: 0.45,
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    relevanceScore: 0.88,
    url: '#'
  },
  {
    id: '4',
    title: 'Malware campaign targets financial institutions',
    content: 'Security researchers identify new malware strain targeting banking systems globally...',
    source: 'ThreatIntel',
    keywords: ['malware', 'threat', 'financial'],
    sentiment: 'negative',
    sentimentScore: 0.89,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    relevanceScore: 0.93,
    url: '#'
  },
  {
    id: '5',
    title: 'Cloud infrastructure improvements announced',
    content: 'Major cloud providers invest in security enhancements and performance optimization...',
    source: 'TechNews',
    keywords: ['cloud', 'infrastructure', 'security'],
    sentiment: 'positive',
    sentimentScore: 0.81,
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    relevanceScore: 0.79,
    url: '#'
  },
]

const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Critical Security Threat Detected',
    description: 'Zero-day vulnerability in production database system',
    severity: 'critical',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    triggeredBy: 'Automated Security Scan',
  },
  {
    id: 'alert-2',
    title: 'Unusual Network Activity',
    description: 'Spike in traffic from unknown geographic regions',
    severity: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    triggeredBy: 'Network Monitoring',
  },
  {
    id: 'alert-3',
    title: 'Failed Authentication Attempts',
    description: '50+ failed login attempts detected in the last hour',
    severity: 'medium',
    status: 'acknowledged',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    triggeredBy: 'Access Control System',
  },
  {
    id: 'alert-4',
    title: 'Policy Violation',
    description: 'Data export detected outside approved hours',
    severity: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    triggeredBy: 'DLP System',
  },
  {
    id: 'alert-5',
    title: 'System Update Required',
    description: 'Critical patches available for installed software',
    severity: 'medium',
    status: 'resolved',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    triggeredBy: 'Patch Management',
  },
]

const mockKeywords: KeywordFrequency[] = [
  { keyword: 'security', frequency: 245, trend: 'up' },
  { keyword: 'vulnerability', frequency: 189, trend: 'up' },
  { keyword: 'threat', frequency: 156, trend: 'stable' },
  { keyword: 'data breach', frequency: 142, trend: 'down' },
  { keyword: 'compliance', frequency: 128, trend: 'up' },
  { keyword: 'encryption', frequency: 105, trend: 'stable' },
  { keyword: 'malware', frequency: 98, trend: 'up' },
  { keyword: 'authentication', frequency: 87, trend: 'down' },
]

const generateSentimentData = (): SentimentData[] => {
  const data: SentimentData[] = []
  for (let i = 30; i > 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60000)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      positive: Math.floor(Math.random() * 40) + 20,
      neutral: Math.floor(Math.random() * 30) + 30,
      negative: Math.floor(Math.random() * 35) + 15,
    })
  }
  return data
}

const generateTrendData = (): TrendData[] => {
  const data: TrendData[] = []
  for (let i = 30; i > 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60000)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mentions: Math.floor(Math.random() * 300) + 150,
      alerts: Math.floor(Math.random() * 20) + 5,
      sentiment: Math.random() * 100,
    })
  }
  return data
}

export const mockMetrics: DashboardMetrics = {
  totalAlerts: 12,
  activeAlerts: 3,
  monitoredKeywords: 8,
  activeFeeds: 42,
  sentimentScore: 7.2,
  trendsCount: 5,
}

export const getMockFeeds = (): OsintFeed[] => [...mockFeeds]
export const getMockAlerts = (): Alert[] => [...mockAlerts]
export const getMockKeywords = (): KeywordFrequency[] => [...mockKeywords]
export const getMockSentimentData = (): SentimentData[] => generateSentimentData()
export const getMockTrendData = (): TrendData[] => generateTrendData()
export const getMockMetrics = (): DashboardMetrics => ({ ...mockMetrics })
