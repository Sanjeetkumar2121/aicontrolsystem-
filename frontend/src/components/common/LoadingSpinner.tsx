import React from 'react'

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-border rounded-full"></div>
        <div
          className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin"
          style={{ animationDuration: '0.8s' }}
        ></div>
      </div>
    </div>
  )
}
