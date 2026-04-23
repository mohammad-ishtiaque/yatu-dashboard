// Placeholder — structure mirrors UsersPage, fill with mockRiders
import { mockRiders } from '@/data/mock'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Star } from 'lucide-react'

export default function RidersPage() {
  return (
    <div className="space-y-4 max-w-[1400px]">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Riders</h2>
        <p className="text-sm text-gray-500">{mockRiders.length} registered riders</p>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Rider', 'Phone', 'Total Trips', 'Rating', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold
                                       text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockRiders.map(rider => (
              <tr key={rider.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={rider.name} size="sm" />
                    <span className="text-sm font-medium text-gray-900">{rider.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{rider.phone}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{rider.totalTrips}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {rider.rating}
                  </div>
                </td>
                <td className="px-5 py-3.5"><Badge status={rider.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
