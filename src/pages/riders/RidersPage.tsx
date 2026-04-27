import { useState } from 'react'
import { Search, Eye, Ban, CheckCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useRiders, useBlockRider, useUnblockRider } from '@/lib/hooks/useRiders'
import { ROUTES } from '@/constants/routes'
import type { Rider, RiderStatus } from '@/types'

const LIMIT = 8

const STATUS_TABS: { label: string; value: RiderStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Active',    value: 'active'    },
  { label: 'On Trip',   value: 'on_trip'   },
  { label: 'Inactive',  value: 'inactive'  },
  { label: 'Suspended', value: 'suspended' },
]

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="skeleton w-8 h-8 rounded-full" /><div className="skeleton h-3 w-28" /></div></td>
          <td className="px-5 py-3.5"><div className="skeleton h-3 w-24" /></td>
          <td className="px-5 py-3.5"><div className="skeleton h-3 w-12" /></td>
          <td className="px-5 py-3.5"><div className="skeleton h-3 w-12" /></td>
          <td className="px-5 py-3.5"><div className="skeleton h-5 w-14 rounded-full" /></td>
          <td className="px-5 py-3.5"><div className="skeleton h-7 w-20" /></td>
        </tr>
      ))}
    </>
  )
}

export default function RidersPage() {
  const [page,   setPage]   = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<RiderStatus | 'all'>('all')
  const [blockTarget, setBlockTarget] = useState<Rider | null>(null)

  function handleSearch(v: string) { setSearch(v); setPage(1) }
  function handleStatus(v: RiderStatus | 'all') { setStatus(v); setPage(1) }

  const { data, isLoading, isPlaceholderData } = useRiders({ page, limit: LIMIT, search, status })
  const blockRider   = useBlockRider()
  const unblockRider = useUnblockRider()

  const blockTarget_isBlocked = blockTarget?.status === 'suspended'

  async function handleBlock() {
    if (!blockTarget) return
    if (blockTarget_isBlocked) {
      await unblockRider.mutateAsync(blockTarget.id)
    } else {
      await blockRider.mutateAsync(blockTarget.id)
    }
    setBlockTarget(null)
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Rider</h2>
          <p className="text-sm text-gray-500">{data ? `${data.total} registered riders` : 'Loading...'}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg flex-wrap">
          {STATUS_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => handleStatus(t.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${status === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`card overflow-hidden transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Rider', 'Phone', 'Total Trips', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? <TableSkeleton /> : data?.data.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-400">No riders match your search.</td></tr>
              ) : data?.data.map(rider => (
                <tr key={rider.id} className="hover:bg-gray-50/50 transition-colors animate-fade-in">
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
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={ROUTES.RIDER_DETAIL(rider.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-50 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View
                      </Link>
                      <button
                        onClick={() => setBlockTarget(rider)}
                        className={`inline-flex items-center gap-1 text-xs font-medium border rounded-lg px-2.5 py-1 transition-colors ${
                          rider.status === 'suspended'
                            ? 'text-green-600 border-green-200 hover:bg-green-50'
                            : 'text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-red-500 hover:border-red-200'
                        }`}
                      >
                        {rider.status === 'suspended'
                          ? <><CheckCircle className="w-3 h-3" /> Unblock</>
                          : <><Ban className="w-3 h-3" /> Block</>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && <Pagination page={page} totalPages={data.totalPages} total={data.total} limit={LIMIT} onPageChange={setPage} />}
      </div>

      {/* Block confirmation */}
      <Modal
        isOpen={Boolean(blockTarget)}
        onClose={() => setBlockTarget(null)}
        title={blockTarget_isBlocked ? 'Unblock rider' : 'Block rider'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setBlockTarget(null)}>Cancel</Button>
            <Button
              variant={blockTarget_isBlocked ? 'secondary' : 'danger'}
              size="sm"
              isLoading={blockRider.isPending || unblockRider.isPending}
              onClick={handleBlock}
            >
              {blockTarget_isBlocked ? 'Unblock' : 'Block rider'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {blockTarget_isBlocked
            ? `Unblock ${blockTarget?.name}? They will regain access to accept trips.`
            : `Block ${blockTarget?.name}? They will not be able to accept new trips.`
          }
        </p>
      </Modal>
    </div>
  )
}
