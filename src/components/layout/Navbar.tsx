import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { 
  Bell, 
  Search, 
  User, 
  RefreshCw,
  AlertTriangle,
  Clock
} from 'lucide-react'

export const Navbar = () => {
  const { user } = useAuth()
  const { alerts, refetchData, isLoading } = useData()
  const [searchQuery, setSearchQuery] = useState('')

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length

  return (
    <header className="bg-background-secondary border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search threats, sources, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-6">
          {/* Refresh */}
          <button
            onClick={refetchData}
            disabled={isLoading}
            className="p-2 rounded-lg text-foreground-secondary hover:bg-background-tertiary hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-foreground-secondary hover:bg-background-tertiary hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            {criticalAlerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {criticalAlerts}
              </span>
            )}
          </button>

          {/* Critical Alert Banner */}
          {criticalAlerts > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-error" />
              <span className="text-xs font-medium text-error">
                {criticalAlerts} Critical
              </span>
            </div>
          )}

          {/* Time */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
            <Clock className="w-4 h-4 text-foreground-secondary" />
            <span className="text-sm text-foreground-secondary">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
              <p className="text-xs text-foreground-secondary">Analyst</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
