import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface DonutChartProps {
  activeUsers: number
  activeDrivers: number
  isLoading?: boolean
}

function DonutSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="skeleton w-32 h-32 rounded-full" />
      <div className="space-y-2 w-full">
        <div className="skeleton h-3 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  )
}

export function DonutChart({ activeUsers, activeDrivers, isLoading }: DonutChartProps) {
  if (isLoading) return <DonutSkeleton />
  const total = activeUsers + activeDrivers
  const data = [
    { name: 'Active Users',   value: activeUsers,   color: '#E53935' },
    { name: 'Active Drivers', value: activeDrivers, color: '#FCA5A5' },
  ]
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{Math.round((activeUsers / total) * 100)}%</span>
          <span className="text-[10px] text-gray-400">Active</span>
        </div>
      </div>
      <div className="w-full mt-3 space-y-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
              <span className="text-gray-600">{entry.name}</span>
            </div>
            <span className="font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
