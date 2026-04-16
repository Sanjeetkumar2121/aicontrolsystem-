import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export const Navbar: React.FC = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-background-secondary border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search alerts, feeds, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Right side - User info & time */}
        <div className="flex items-center gap-6 ml-6">
          <div className="text-right">
            <p className="text-sm text-foreground-secondary">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
