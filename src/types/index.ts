// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

// OSINT Feed Types
export interface OsintFeed {
  id: string;
  title: string;
  content: string;
  source: string;
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  timestamp: string;
  url?: string;
  relevanceScore: number;
}

// Alert Types
export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'acknowledged';
  createdAt: string;
  triggeredBy: string;
  data?: Record<string, unknown>;
}

// Analytics Types
export interface KeywordFrequency {
  keyword: string;
  frequency: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface TrendData {
  date: string;
  mentions: number;
  alerts: number;
  sentiment: number;
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalAlerts: number;
  activeAlerts: number;
  monitoredKeywords: number;
  activeFeeds: number;
  sentimentScore: number;
  trendsCount: number;
}

// Data Context Types
export interface DataContextType {
  feeds: OsintFeed[];
  alerts: Alert[];
  metrics: DashboardMetrics;
  keywords: KeywordFrequency[];
  sentimentData: SentimentData[];
  trendData: TrendData[];
  isLoading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}

// UI Context Types
export interface UIContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>;
  addNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  removeNotification: (id: string) => void;
}
