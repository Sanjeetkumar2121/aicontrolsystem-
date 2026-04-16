import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useData } from '../context/DataContext'
import { Alert as AlertType } from '../types/index'

export const Alerts: React.FC = () => {
  const { alerts, isLoading, error } = useData()
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredAlerts = alerts.filter((alert) => {
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus
    return severityMatch && statusMatch
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-error text-white'
      case 'high':
        return 'bg-warning text-white'
      case 'medium':
        return 'bg-yellow-600 text-white'
      default:
        return 'bg-blue-600 text-white'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-error/20 text-error'
      case 'acknowledged':
        return 'bg-warning/20 text-warning'
      case 'resolved':
        return 'bg-success/20 text-success'
      default:
        return 'bg-foreground-secondary/20 text-foreground-secondary'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg">
          <p className="font-semibold">Error loading alerts</p>
          <p className="text-sm">{error}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <span>🔔</span> Alerts
          </h1>
          <p className="text-foreground-secondary mt-1">Manage security and system alerts</p>
        </div>

        {/* Filters */}
        <div className="card flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Severity</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="flex-1 flex items-end">
            <button className="w-full btn-primary">Apply Filters</button>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="card overflow-x-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground-secondary">No alerts found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Severity</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Triggered By</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert: AlertType) => (
                  <tr
                    key={alert.id}
                    className="border-b border-border hover:bg-background-tertiary transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{alert.title}</p>
                        <p className="text-sm text-foreground-secondary mt-1">{alert.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded font-medium text-sm ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded font-medium text-sm ${getStatusBadge(alert.status)}`}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary text-sm">{alert.triggeredBy}</td>
                    <td className="py-3 px-4 text-foreground-secondary text-sm">{formatDate(alert.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  )
}
