import axios, { AxiosInstance } from 'axios'
import { OsintFeed, Alert, DashboardMetrics, KeywordFrequency, SentimentData, TrendData, User } from '../types/index'
import { getMockFeeds, getMockAlerts, getMockMetrics, getMockKeywords, getMockSentimentData, getMockTrendData } from './mockData'

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: (import.meta.env as any).VITE_API_URL || 'http://localhost:3001/api',
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

// API endpoints
const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // OSINT Data
  FEEDS: '/feeds',
  ALERTS: '/alerts',
  METRICS: '/metrics',
  KEYWORDS: '/keywords',
  SENTIMENT: '/sentiment',
  TRENDS: '/trends',
}

// Mock API class
class MockAPI {
  private useRealAPI = false

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    if (this.useRealAPI) {
      const response = await apiClient.post<{ token: string; user: User }>(API_ENDPOINTS.LOGIN, { email, password })
      return response.data
    }
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      token: 'mock-token-' + Date.now(),
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      }
    }
  }

  async signup(email: string, name: string, password: string): Promise<{ token: string; user: User }> {
    if (this.useRealAPI) {
      const response = await apiClient.post<{ token: string; user: User }>(API_ENDPOINTS.SIGNUP, { email, name, password })
      return response.data
    }
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      token: 'mock-token-' + Date.now(),
      user: {
        id: '1',
        email,
        name,
        createdAt: new Date().toISOString(),
      }
    }
  }

  async logout(): Promise<void> {
    if (this.useRealAPI) {
      await apiClient.post(API_ENDPOINTS.LOGOUT)
    }
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  async getMe(): Promise<User> {
    if (this.useRealAPI) {
      const response = await apiClient.get<User>(API_ENDPOINTS.ME)
      return response.data
    }
    const user = localStorage.getItem('user')
    if (!user) throw new Error('Not authenticated')
    return JSON.parse(user)
  }

  async getFeeds(): Promise<OsintFeed[]> {
    if (this.useRealAPI) {
      const response = await apiClient.get<OsintFeed[]>(API_ENDPOINTS.FEEDS)
      return response.data
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    return getMockFeeds()
  }

  async getAlerts(): Promise<Alert[]> {
    if (this.useRealAPI) {
      const response = await apiClient.get<Alert[]>(API_ENDPOINTS.ALERTS)
      return response.data
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    return getMockAlerts()
  }

  async getMetrics(): Promise<DashboardMetrics> {
    if (this.useRealAPI) {
      const response = await apiClient.get<DashboardMetrics>(API_ENDPOINTS.METRICS)
      return response.data
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    return getMockMetrics()
  }

  async getKeywords(): Promise<KeywordFrequency[]> {
    if (this.useRealAPI) {
      const response = await apiClient.get<KeywordFrequency[]>(API_ENDPOINTS.KEYWORDS)
      return response.data
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    return getMockKeywords()
  }

  async getSentimentData(): Promise<SentimentData[]> {
    if (this.useRealAPI) {
      const response = await apiClient.get<SentimentData[]>(API_ENDPOINTS.SENTIMENT)
      return response.data
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    return getMockSentimentData()
  }

  async getTrendData(): Promise<TrendData[]> {
    if (this.useRealAPI) {
      const response = await apiClient.get<TrendData[]>(API_ENDPOINTS.TRENDS)
      return response.data
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    return getMockTrendData()
  }

  async createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
    if (this.useRealAPI) {
      const response = await apiClient.post<Alert>(API_ENDPOINTS.ALERTS, alert)
      return response.data
    }
    return {
      ...alert,
      id: 'alert-' + Date.now(),
      createdAt: new Date().toISOString(),
    }
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    if (this.useRealAPI) {
      const response = await apiClient.patch<Alert>(`${API_ENDPOINTS.ALERTS}/${id}`, updates)
      return response.data
    }
    return {
      id,
      title: 'Alert',
      description: 'Updated alert',
      severity: 'medium',
      status: 'active',
      createdAt: new Date().toISOString(),
      triggeredBy: 'System',
      ...updates,
    }
  }
}

export const api = new MockAPI()
