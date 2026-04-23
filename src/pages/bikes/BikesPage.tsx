import { mockBikes } from '@/data/mock'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/formatters'

export default function BikesPage() {
  return (
    <div className="space-y-4 max-w-[1400px]">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Bike Management</h2>
        <p className="text-sm text-gray-500">{mockBikes.length} bikes registered</p>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Model', 'Plate', 'Location', 'Last Service', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockBikes.map(b => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{b.model}</td>
                <td className="px-5 py-3.5 text-sm font-mono text-gray-600">{b.plateNumber}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{b.location}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(b.lastServiceDate)}</td>
                <td className="px-5 py-3.5"><Badge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
