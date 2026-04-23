import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { formatDate, truncate } from '@/lib/utils/formatters'
import { ROUTES } from '@/constants/routes'
import type { User } from '@/types'

interface RecentUsersTableProps {
  users: User[]
  isLoading?: boolean
}

// Table skeleton — mimics exact table layout
function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-50">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5">
          <div className="skeleton w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-2.5 w-48" />
          </div>
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  )
}

const TABLE_HEADERS = ['User', 'Contact', 'Joined', 'Status', '']

export function RecentUsersTable({ users, isLoading }: RecentUsersTableProps) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Recently joined</h3>
        <Link
          to={ROUTES.USERS}
          className="text-xs text-red-500 hover:text-red-600 font-medium
                     flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                {TABLE_HEADERS.map((h) => (
                  <th key={h}
                      className="px-5 py-2.5 text-left text-[11px] font-semibold
                                 text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id}
                    className="hover:bg-gray-50/50 transition-colors group">
                  {/* User name + avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                      <span className="text-sm font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  {/* Contact */}
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm text-gray-700">{user.phone}</p>
                      <p className="text-xs text-gray-400">{truncate(user.email, 25)}</p>
                    </div>
                  </td>
                  {/* Joined date */}
                  <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(user.joinedAt)}
                  </td>
                  {/* Status badge */}
                  <td className="px-5 py-3.5">
                    <Badge status={user.status} />
                  </td>
                  {/* Action */}
                  <td className="px-5 py-3.5">
                    <Link
                      to={ROUTES.USER_DETAIL(user.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity
                                 text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
