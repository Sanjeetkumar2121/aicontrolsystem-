import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { SentimentData } from '../../types/index'
import { Activity } from 'lucide-react'

interface SentimentChartProps {
  data: SentimentData[]
}

export const SentimentChart = ({ data }: SentimentChartProps) => {
  return (
    <div className="card">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-accent" />
        Sentiment Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area 
            type="monotone" 
            dataKey="positive" 
            stackId="1" 
            stroke="#10b981" 
            strokeWidth={2}
            fill="url(#colorPositive)" 
            name="Positive"
          />
          <Area 
            type="monotone" 
            dataKey="neutral" 
            stackId="1" 
            stroke="#64748b" 
            strokeWidth={2}
            fill="url(#colorNeutral)" 
            name="Neutral"
          />
          <Area 
            type="monotone" 
            dataKey="negative" 
            stackId="1" 
            stroke="#ef4444" 
            strokeWidth={2}
            fill="url(#colorNegative)" 
            name="Negative"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
