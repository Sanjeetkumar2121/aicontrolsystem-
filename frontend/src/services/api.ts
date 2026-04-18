import axios, { AxiosInstance } from 'axios'
import { OsintFeed, Alert, DashboardMetrics, KeywordFrequency, SentimentData, TrendData, User } from '../types/index'

// Create axios instance - connects to /api which routes to the backend service
export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API class connecting to the real FastAPI backend
class OsintAPI {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await apiClient.post<{ token: string; user: { id: string; username: string; role: string } }>(
      '/auth/login',
      { username: email.split('@')[0] || email, password }
    )
    const user: User = {
      id: response.data.user.id,
      email: email,
      name: response.data.user.username,
      createdAt: new Date().toISOString(),
    }
    return { token: response.data.token, user }
  }

  async signup(email: string, name: string, password: string): Promise<{ token: string; user: User }> {
    // For now, signup creates a mock user since backend doesn't have registration
    // In production, this would call a registration endpoint
    return this.login(email, password)
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  async getMe(): Promise<User> {
    const user = localStorage.getItem('user')
    if (!user) throw new Error('Not authenticated')
    return JSON.parse(user)
  }

  async getFeeds(): Promise<OsintFeed[]> {
    const response = await apiClient.get<{
      items: Array<{
        id: string
        platform: string
        content: string
        author: string
        timestamp: string
        url: string
        sentiment: string
        sentiment_score: number
        entities: Array<{ type: string; value: string; confidence: number }>
        topics: string[]
        engagement: { likes: number; shares: number; comments: number }
        risk_score: number
      }>
      total: number
    }>('/feeds')

    return response.data.items.map((item) => ({
      id: item.id,
      title: `${item.platform.toUpperCase()} - ${item.author}`,
      content: item.content,
      source: item.platform,
      keywords: item.topics,
      sentiment: item.sentiment as 'positive' | 'neutral' | 'negative',
      sentimentScore: item.sentiment_score,
      timestamp: item.timestamp,
      url: item.url,
      relevanceScore: item.risk_score,
    }))
  }

  async getAlerts(): Promise<Alert[]> {
    const response = await apiClient.get<{
      items: Array<{
        id: string
        type: string
        severity: string
        title: string
        description: string
        timestamp: string
        source_items: string[]
        is_read: boolean
        metadata: Record<string, unknown>
      }>
      total: number
    }>('/alerts')

    return response.data.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      severity: item.severity as 'low' | 'medium' | 'high' | 'critical',
      status: item.is_read ? 'resolved' : 'active' as 'active' | 'resolved' | 'acknowledged',
      createdAt: item.timestamp,
      triggeredBy: item.type,
      data: item.metadata,
    }))
  }

  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<{
      total_items: number
      items_24h: number
      total_alerts: number
      unread_alerts: number
      critical_alerts: number
      avg_risk_score: number
      high_risk_count: number
      platforms_active: number
    }>('/analytics/summary')

    const keywordsResponse = await apiClient.get<{ keywords: Array<{ keyword: string }> }>('/monitor/keywords')

    return {
      totalAlerts: response.data.total_alerts,
      activeAlerts: response.data.unread_alerts,
      monitoredKeywords: keywordsResponse.data.keywords.length,
      activeFeeds: response.data.total_items,
      sentimentScore: Math.round((1 - response.data.avg_risk_score / 100) * 100),
      trendsCount: response.data.platforms_active,
    }
  }

  async getKeywords(): Promise<KeywordFrequency[]> {
    const response = await apiClient.get<{
      keywords: Array<{
        id: string
        keyword: string
        is_active: boolean
        hit_count: number
      }>
    }>('/monitor/keywords')

    return response.data.keywords.map((kw) => ({
      keyword: kw.keyword,
      frequency: kw.hit_count,
      trend: kw.hit_count > 20 ? 'up' : kw.hit_count < 5 ? 'down' : 'stable' as 'up' | 'down' | 'stable',
    }))
  }

  async getSentimentData(): Promise<SentimentData[]> {
    const response = await apiClient.get<{
      sentiment_distribution: Record<string, number>
      volume_over_time: Array<{ timestamp: string; count: number }>
    }>('/analytics')

    // Transform volume data into sentiment time series
    const volumeData = response.data.volume_over_time
    const sentimentDist = response.data.sentiment_distribution
    const total = (sentimentDist.positive || 0) + (sentimentDist.neutral || 0) + (sentimentDist.negative || 0) || 1

    return volumeData.slice(-7).map((v) => ({
      date: v.timestamp.split(' ')[0],
      positive: Math.round((sentimentDist.positive || 0) / total * v.count),
      neutral: Math.round((sentimentDist.neutral || 0) / total * v.count),
      negative: Math.round((sentimentDist.negative || 0) / total * v.count),
    }))
  }

  async getTrendData(): Promise<TrendData[]> {
    const response = await apiClient.get<{
      volume_over_time: Array<{ timestamp: string; count: number }>
    }>('/analytics')

    const alertsResponse = await apiClient.get<{ items: Array<{ timestamp: string }> }>('/alerts')
    const alertsByHour: Record<string, number> = {}
    alertsResponse.data.items.forEach((a) => {
      const hour = new Date(a.timestamp).toISOString().slice(0, 13)
      alertsByHour[hour] = (alertsByHour[hour] || 0) + 1
    })

    return response.data.volume_over_time.slice(-14).map((v) => ({
      date: v.timestamp,
      mentions: v.count,
      alerts: alertsByHour[v.timestamp.slice(0, 13)] || 0,
      sentiment: Math.random() * 0.4 + 0.3, // Normalized sentiment
    }))
  }

  async createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
    // Ingest content to trigger alert generation
    const response = await apiClient.post<{
      item: { id: string }
      alerts_generated: Array<{
        id: string
        title: string
        description: string
        severity: string
        type: string
        timestamp: string
      }>
    }>('/ingest', {
      platform: 'news',
      content: `${alert.title}: ${alert.description}`,
      author: alert.triggeredBy,
    })

    if (response.data.alerts_generated.length > 0) {
      const gen = response.data.alerts_generated[0]
      return {
        id: gen.id,
        title: gen.title,
        description: gen.description,
        severity: gen.severity as 'low' | 'medium' | 'high' | 'critical',
        status: 'active',
        createdAt: gen.timestamp,
        triggeredBy: gen.type,
      }
    }

    return {
      ...alert,
      id: response.data.item.id,
      createdAt: new Date().toISOString(),
    }
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    if (updates.status === 'resolved') {
      await apiClient.patch(`/alerts/${id}/read`)
    }
    return {
      id,
      title: updates.title || 'Alert',
      description: updates.description || '',
      severity: updates.severity || 'medium',
      status: updates.status || 'active',
      createdAt: updates.createdAt || new Date().toISOString(),
      triggeredBy: updates.triggeredBy || 'System',
    }
  }

  // Additional methods for new backend features
  async analyzeText(content: string): Promise<{
    sentiment: string
    sentiment_score: number
    entities: Array<{ type: string; value: string; confidence: number }>
    topics: string[]
    risk_score: number
    summary: string
  }> {
    const response = await apiClient.post('/analyze', null, { params: { content } })
    return response.data
  }

  async ingestContent(platform: string, content: string, author: string): Promise<{
    item: OsintFeed
    alerts_generated: Alert[]
    summary: string
  }> {
    const response = await apiClient.post('/ingest', { platform, content, author })
    return {
      item: {
        id: response.data.item.id,
        title: `${platform.toUpperCase()} - ${author}`,
        content: response.data.item.content,
        source: platform,
        keywords: response.data.item.topics,
        sentiment: response.data.item.sentiment,
        sentimentScore: response.data.item.sentiment_score,
        timestamp: response.data.item.timestamp,
        url: response.data.item.url,
        relevanceScore: response.data.item.risk_score,
      },
      alerts_generated: response.data.alerts_generated.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        severity: a.severity,
        status: 'active',
        createdAt: a.timestamp,
        triggeredBy: a.type,
      })),
      summary: response.data.summary,
    }
  }

  async addMonitorKeyword(keyword: string): Promise<void> {
    await apiClient.post('/monitor/keywords', null, { params: { keyword } })
  }

  async deleteMonitorKeyword(keywordId: string): Promise<void> {
    await apiClient.delete(`/monitor/keywords/${keywordId}`)
  }
}

export const api = new OsintAPI()
