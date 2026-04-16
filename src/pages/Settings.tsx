import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'

export const Settings: React.FC = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    critical: true,
    daily: false,
  })
  const [saved, setSaved] = useState(false)

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <span>⚙️</span> Settings
          </h1>
          <p className="text-foreground-secondary mt-1">Manage your account and preferences</p>
        </div>

        {/* Account Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-foreground mb-4 pb-4 border-b border-border">Account</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="px-4 py-2 bg-background border border-border rounded-lg text-foreground">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <div className="px-4 py-2 bg-background border border-border rounded-lg text-foreground">
                {user?.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Member Since</label>
              <div className="px-4 py-2 bg-background border border-border rounded-lg text-foreground text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            <div className="pt-4">
              <button className="btn-secondary">Change Password</button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-foreground mb-4 pb-4 border-b border-border">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-foreground-secondary">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleToggle('email')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  notifications.email
                    ? 'bg-accent text-white'
                    : 'bg-background-tertiary text-foreground'
                }`}
              >
                {notifications.email ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="font-medium text-foreground">Critical Alerts</p>
                <p className="text-sm text-foreground-secondary">Notifications for critical severity alerts</p>
              </div>
              <button
                onClick={() => handleToggle('critical')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  notifications.critical
                    ? 'bg-accent text-white'
                    : 'bg-background-tertiary text-foreground'
                }`}
              >
                {notifications.critical ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="font-medium text-foreground">Daily Digest</p>
                <p className="text-sm text-foreground-secondary">Daily summary of all activities</p>
              </div>
              <button
                onClick={() => handleToggle('daily')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  notifications.daily
                    ? 'bg-accent text-white'
                    : 'bg-background-tertiary text-foreground'
                }`}
              >
                {notifications.daily ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-foreground mb-4 pb-4 border-b border-border">Display</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-foreground-secondary">Currently enabled (default)</p>
              </div>
              <button className="px-4 py-2 bg-accent text-white rounded-lg font-medium">
                On
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="font-medium text-foreground">Refresh Rate</p>
                <p className="text-sm text-foreground-secondary">Update interval for live feeds</p>
              </div>
              <select className="px-3 py-2 bg-background border border-border rounded-lg text-foreground">
                <option>30 seconds</option>
                <option>1 minute</option>
                <option>5 minutes</option>
                <option>10 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Section */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            Save Changes
          </button>
          <button className="btn-secondary">
            Cancel
          </button>
        </div>

        {saved && (
          <div className="p-4 bg-success/10 border border-success text-success rounded-lg flex items-center gap-2">
            <span>✓</span>
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>
    </Layout>
  )
}
