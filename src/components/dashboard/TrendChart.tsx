import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendData } from '../../types/index'
import { TrendingUp } from 'lucide-react'

interface TrendChartProps {
  data: TrendData[]
}

export const TrendChart = ({ data }: TrendChartProps) => {
  return (
    <div className="card">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-accent" />
        Activity Trends
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#cbd5e1" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#cbd5e1" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />
          <Line
            type="monotone"
            dataKey="mentions"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2.5}
            name="Mentions"
          />
          <Line
            type="monotone"
            dataKey="alerts"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2.5}
            name="Alerts"
          />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="#10b981"
            dot={false}
            strokeWidth={2.5}
            name="Sentiment"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
