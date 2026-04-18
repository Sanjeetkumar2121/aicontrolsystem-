import { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useData } from '../context/DataContext'
import { Alert as AlertType } from '../types/index'
import { Bell, Filter, AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export const Alerts = () => {
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
        return 'bg-accent text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4" />
      case 'acknowledged':
        return <Clock className="w-4 h-4" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-error/20 text-error border-error/30'
      case 'acknowledged':
        return 'bg-warning/20 text-warning border-warning/30'
      case 'resolved':
        return 'bg-success/20 text-success border-success/30'
      default:
        return 'bg-foreground-secondary/20 text-foreground-secondary border-foreground-secondary/30'
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
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading alerts</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Bell className="w-6 h-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
            <p className="text-foreground-secondary text-sm">Manage security and system alerts</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-foreground-secondary" />
            <span className="text-sm font-medium text-foreground">Filters</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
            <p className="text-xs text-foreground-secondary">Total Alerts</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-error">{alerts.filter(a => a.status === 'active').length}</p>
            <p className="text-xs text-foreground-secondary">Active</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-warning">{alerts.filter(a => a.severity === 'critical').length}</p>
            <p className="text-xs text-foreground-secondary">Critical</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-success">{alerts.filter(a => a.status === 'resolved').length}</p>
            <p className="text-xs text-foreground-secondary">Resolved</p>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="card overflow-x-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-foreground-secondary mx-auto mb-3 opacity-50" />
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
                        <p className="text-sm text-foreground-secondary mt-1 line-clamp-1">{alert.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded font-medium text-sm ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded font-medium text-sm border ${getStatusBadge(alert.status)}`}>
                        {getStatusIcon(alert.status)}
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
