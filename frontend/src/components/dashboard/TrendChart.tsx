import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendData } from '../../types/index'

interface TrendChartProps {
  data: TrendData[]
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <div className="card">
      <h2 className="text-lg font-bold text-foreground mb-4">Activity Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="date" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="mentions"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            name="Mentions"
          />
          <Line
            type="monotone"
            dataKey="alerts"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2}
            name="Alerts"
          />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="#10b981"
            dot={false}
            strokeWidth={2}
            name="Sentiment"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
