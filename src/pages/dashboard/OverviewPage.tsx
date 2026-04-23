import { useState } from 'react'
import { Users, Bike, UserCheck } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { BarChart } from '@/components/charts/BarChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { RecentUsersTable } from '@/components/features/dashboard/RecentUsersTable'
import { useDashboardStats, useGrowthData } from '@/lib/hooks/useDashboard'
import { useUsers } from '@/lib/hooks/useUsers'

export default function OverviewPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const { data: stats,  isLoading: statsLoading  } = useDashboardStats()
  const { data: growth, isLoading: growthLoading } = useGrowthData(year)
  const { data: usersData, isLoading: usersLoading } = useUsers({ page: 1, limit: 5 })

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="Total Riders" value={stats?.totalRiders ?? 0} icon={Bike}       iconBgColor="bg-orange-100" iconColor="text-orange-500" trend={{ value: 12, direction: 'up' }} isLoading={statsLoading} />
        <StatCard label="Total Users"  value={stats?.totalUsers  ?? 0} icon={Users}      iconBgColor="bg-blue-100"   iconColor="text-blue-500"   trend={{ value: 8,  direction: 'up' }} isLoading={statsLoading} />
        <StatCard label="Total Bikes"  value={stats?.totalBikes  ?? 0} icon={UserCheck}  iconBgColor="bg-red-100"    iconColor="text-red-500"    trend={{ value: 3,  direction: 'up' }} isLoading={statsLoading} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">User growth</h3>
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500/20">
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>
          <BarChart data={growth ?? []} isLoading={growthLoading} />
        </div>
        <div className="card p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity statistics</h3>
          <div className="flex-1 flex items-center justify-center">
            <DonutChart activeUsers={stats?.activeUsers ?? 0} activeDrivers={stats?.activeDrivers ?? 0} isLoading={statsLoading} />
          </div>
        </div>
      </div>
      <RecentUsersTable users={usersData?.data ?? []} isLoading={usersLoading} />
    </div>
  )
}
