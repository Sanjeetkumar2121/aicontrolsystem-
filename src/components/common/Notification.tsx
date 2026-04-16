import React, { useEffect } from 'react'

export interface NotificationProps {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose?: (id: string) => void
}

export const Notification: React.FC<NotificationProps> = ({
  id,
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const getStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-success/20 border-success text-success'
      case 'error':
        return 'bg-error/20 border-error text-error'
      case 'warning':
        return 'bg-warning/20 border-warning text-warning'
      default:
        return 'bg-accent/20 border-accent text-accent'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${getStyle()} animate-in fade-in slide-in-from-top`}>
      <span className="text-xl flex-shrink-0">{getIcon()}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose?.(id)}
        className="flex-shrink-0 text-lg hover:opacity-70 transition-opacity"
      >
        ✕
      </button>
    </div>
  )
}

interface NotificationContainerProps {
  notifications: Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>
  onClose: (id: string) => void
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onClose}
          duration={5000}
        />
      ))}
    </div>
  )
}
