import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, Shield, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useUser, useToggleUserStatus, useDeleteUser } from '@/lib/hooks/useUsers'
import { formatDate } from '@/lib/utils/formatters'
import { ROUTES } from '@/constants/routes'
import type { UserStatus } from '@/types'

// Info row — reusable within this file only (not exported)
function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

const NEXT_STATUS: Record<UserStatus, { label: string; next: UserStatus }> = {
  active:    { label: 'Deactivate',   next: 'inactive'  },
  inactive:  { label: 'Activate',     next: 'active'    },
  suspended: { label: 'Reinstate',    next: 'active'    },
}

export default function UserDetailPage() {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const [showDelete, setShowDelete] = useState(false)

  const { data: user, isLoading, error } = useUser(id ?? '')
  const toggleStatus = useToggleUserStatus()
  const deleteUser   = useDeleteUser()

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="skeleton h-8 w-32" />
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="skeleton w-16 h-16 rounded-full" />
            <div className="space-y-2"><div className="skeleton h-5 w-40" /><div className="skeleton h-3 w-24" /></div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !user) {
    return (
      <div className="max-w-2xl">
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">User not found.</p>
          <Link to={ROUTES.USERS} className="text-sm text-red-500 hover:text-red-600 font-medium">
            ← Back to Users
          </Link>
        </div>
      </div>
    )
  }

  const statusAction = NEXT_STATUS[user.status]

  async function handleToggleStatus() {
    await toggleStatus.mutateAsync({ id: user!.id, status: statusAction.next })
  }

  async function handleDelete() {
    await deleteUser.mutateAsync(user!.id)
    navigate(ROUTES.USERS)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to={ROUTES.USERS} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Users
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">{user.name}</span>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} src={user.avatarUrl} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              <div className="mt-1.5"><Badge status={user.status} /></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Info rows */}
        <div className="mb-6">
          <InfoRow icon={Mail}     label="Email"   value={user.email} />
          <InfoRow icon={Phone}    label="Phone"   value={user.phone} />
          <InfoRow icon={Calendar} label="Joined"  value={formatDate(user.joinedAt)} />
          <InfoRow icon={Shield}   label="Role"    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
        </div>

        {/* Status toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-900">Account status</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Currently <span className="font-medium">{user.status}</span>
            </p>
          </div>
          <Button
            variant={user.status === 'active' ? 'danger' : 'secondary'}
            size="sm"
            isLoading={toggleStatus.isPending}
            onClick={handleToggleStatus}
          >
            {statusAction.label}
          </Button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete user"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" size="sm" isLoading={deleteUser.isPending} onClick={handleDelete}>
              Delete permanently
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{user.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
