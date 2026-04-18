import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const { logout } = useAuth()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-background-secondary border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
          <span>🔍</span> OSINT Hub
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-accent text-white'
                : 'text-foreground-secondary hover:bg-background-tertiary'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full px-4 py-2 text-left rounded-lg text-foreground-secondary hover:bg-background-tertiary transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
