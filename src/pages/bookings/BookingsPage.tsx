import { mockBookings } from '@/data/mock'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatCurrency } from '@/lib/utils/formatters'

export default function BookingsPage() {
  return (
    <div className="space-y-4 max-w-[1400px]">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
        <p className="text-sm text-gray-500">{mockBookings.length} total bookings</p>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['ID', 'Pickup', 'Dropoff', 'Fare', 'Date', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockBookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5 text-xs font-mono text-gray-400">{b.id}</td>
                <td className="px-5 py-3.5 text-sm text-gray-700">{b.pickupLocation}</td>
                <td className="px-5 py-3.5 text-sm text-gray-700">{b.dropoffLocation}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{formatCurrency(b.fare)}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(b.createdAt)}</td>
                <td className="px-5 py-3.5"><Badge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
