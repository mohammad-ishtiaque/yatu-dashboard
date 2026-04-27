import { useState } from 'react'
import { Search, UserPlus, Eye, Ban, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { Modal } from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils/formatters'
import { useUsers, useToggleUserStatus } from '@/lib/hooks/useUsers'
import { ROUTES } from '@/constants/routes'
import type { User, UserStatus } from '@/types'

const LIMIT = 8

const STATUS_TABS: { label: string; value: UserStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Active',    value: 'active'    },
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
          <td className="px-5 py-3.5"><div className="skeleton h-3 w-32" /></td>
          <td className="px-5 py-3.5"><div className="skeleton h-3 w-16" /></td>
          <td className="px-5 py-3.5"><div className="skeleton h-3 w-20" /></td>
          <td className="px-5 py-3.5"><div className="skeleton h-5 w-14 rounded-full" /></td>
          <td className="px-5 py-3.5"><div className="skeleton h-7 w-28" /></td>
        </tr>
      ))}
    </>
  )
}

export default function UsersPage() {
  const [page,   setPage]   = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<UserStatus | 'all'>('all')
  const [blockTarget, setBlockTarget] = useState<User | null>(null)

  function handleSearch(v: string) { setSearch(v); setPage(1) }
  function handleStatus(v: UserStatus | 'all') { setStatus(v); setPage(1) }

  const { data, isLoading, isPlaceholderData } = useUsers({ page, limit: LIMIT, search, status })
  const toggleStatus = useToggleUserStatus()

  const blockTarget_isBlocked = blockTarget?.status === 'suspended'

  async function handleBlock() {
    if (!blockTarget) return
    const nextStatus: UserStatus = blockTarget_isBlocked ? 'active' : 'suspended'
    await toggleStatus.mutateAsync({ id: blockTarget.id, status: nextStatus })
    setBlockTarget(null)
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User</h2>
          <p className="text-sm text-gray-500">{data ? `${data.total} total users` : 'Loading...'}</p>
        </div>
        {/* <Button leftIcon={<UserPlus className="w-4 h-4" />} size="sm">Add User</Button> */}
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="search" value={search} onChange={e => handleSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_TABS.map(t => (
            <button key={t.value} onClick={() => handleStatus(t.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${status === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`card overflow-hidden transition-opacity ${isPlaceholderData ? 'opacity-60' : 'opacity-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['User', 'Phone', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? <TableSkeleton /> : data?.data.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-400">No users match your search.</td></tr>
              ) : data?.data.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors animate-fade-in">
                  <td className="px-5 py-3.5"><div className="flex items-center gap-3"><Avatar name={user.name} size="sm" /><span className="text-sm font-medium text-gray-900">{user.name}</span></div></td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{user.email}</td>
                  <td className="px-5 py-3.5"><span className="text-xs capitalize text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{user.role}</span></td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{formatDate(user.joinedAt)}</td>
                  <td className="px-5 py-3.5"><Badge status={user.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={ROUTES.USER_DETAIL(user.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-50 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View
                      </Link>
                      <button
                        onClick={() => setBlockTarget(user)}
                        className={`inline-flex items-center gap-1 text-xs font-medium border rounded-lg px-2.5 py-1 transition-colors ${
                          user.status === 'suspended'
                            ? 'text-green-600 border-green-200 hover:bg-green-50'
                            : 'text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-red-500 hover:border-red-200'
                        }`}
                      >
                        {user.status === 'suspended'
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

      {/* Block/Unblock confirmation */}
      <Modal
        isOpen={Boolean(blockTarget)}
        onClose={() => setBlockTarget(null)}
        title={blockTarget_isBlocked ? 'Unblock user' : 'Block user'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setBlockTarget(null)}>Cancel</Button>
            <Button
              variant={blockTarget_isBlocked ? 'secondary' : 'danger'}
              size="sm"
              isLoading={toggleStatus.isPending}
              onClick={handleBlock}
            >
              {blockTarget_isBlocked ? 'Unblock' : 'Block user'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {blockTarget_isBlocked
            ? `Unblock ${blockTarget?.name}? They will regain access to the app.`
            : `Block ${blockTarget?.name}? They will lose access to the app.`
          }
        </p>
      </Modal>
    </div>
  )
}
