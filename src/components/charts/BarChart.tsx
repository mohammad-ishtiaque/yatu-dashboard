import {
  BarChart as RechartsBar, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { GrowthDataPoint } from '@/types'

interface BarChartProps {
  data: GrowthDataPoint[]
  isLoading?: boolean
}

// Custom tooltip for better UX than recharts default
function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-gray-600">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ background: p.color }} />
          {p.name}: <span className="font-medium text-gray-900">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex items-end gap-2 h-48 px-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="skeleton flex-1"
             style={{ height: `${30 + Math.random() * 70}%` }} />
      ))}
    </div>
  )
}

export function BarChart({ data, isLoading }: BarChartProps) {
  if (isLoading) return <ChartSkeleton />

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsBar data={data} barSize={8}
                   margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
        />
        <Bar dataKey="users"  name="Users"  fill="#E53935" radius={[4,4,0,0]} />
        <Bar dataKey="riders" name="Riders" fill="#FCA5A5" radius={[4,4,0,0]} />
      </RechartsBar>
    </ResponsiveContainer>
  )
}
