import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, Star, MapPin, FileText, Ban, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useRider, useBlockRider, useUnblockRider } from '@/lib/hooks/useRiders'
import { formatDate } from '@/lib/utils/formatters'
import { ROUTES } from '@/constants/routes'

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

export default function RiderDetailPage() {
  const { id }    = useParams<{ id: string }>()
  const navigate  = useNavigate()
  const [showBlockModal, setShowBlockModal] = useState(false)

  const { data: rider, isLoading, error } = useRider(id ?? '')
  const blockRider   = useBlockRider()
  const unblockRider = useUnblockRider()

  const isBlocked = rider?.status === 'suspended'

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="skeleton h-8 w-32" />
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="skeleton w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-5 w-40" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
        </div>
      </div>
    )
  }

  if (error || !rider) {
    return (
      <div className="max-w-2xl">
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">Rider not found.</p>
          <Link to={ROUTES.RIDERS} className="text-sm text-red-500 hover:text-red-600 font-medium">
            ← Back to Riders
          </Link>
        </div>
      </div>
    )
  }

  async function handleBlock() {
    if (!rider) return
    if (isBlocked) {
      await unblockRider.mutateAsync(rider.id)
    } else {
      await blockRider.mutateAsync(rider.id)
    }
    setShowBlockModal(false)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to={ROUTES.RIDERS} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Riders
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">{rider.name}</span>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Avatar name={rider.name} src={rider.avatarUrl} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{rider.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5 text-sm text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-medium">{rider.rating}</span>
                <span className="text-gray-400 font-normal">/ 5.0</span>
              </div>
              <div className="mt-1.5"><Badge status={rider.status} /></div>
            </div>
          </div>
          <Button
            variant={isBlocked ? 'secondary' : 'danger'}
            size="sm"
            leftIcon={isBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
            onClick={() => setShowBlockModal(true)}
          >
            {isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{rider.totalTrips}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Trips</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-xl font-bold text-gray-900">{rider.rating}</p>
            <p className="text-xs text-gray-500 mt-0.5">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 capitalize">{rider.status.replace('_', ' ')}</p>
            <p className="text-xs text-gray-500 mt-0.5">Status</p>
          </div>
        </div>

        {/* Info rows */}
        <div>
          <InfoRow icon={Mail}     label="Email"        value={rider.email} />
          <InfoRow icon={Phone}    label="Phone"        value={rider.phone} />
          <InfoRow icon={Calendar} label="Joined"       value={formatDate(rider.joinedAt)} />
          {rider.vehicleType   && <InfoRow icon={FileText} label="Vehicle Type"    value={rider.vehicleType} />}
          {rider.licenseNumber && <InfoRow icon={FileText} label="License Number"  value={rider.licenseNumber} />}
          {rider.address       && <InfoRow icon={MapPin}   label="Address"         value={rider.address} />}
        </div>
      </div>

      {/* Block/Unblock confirmation */}
      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={isBlocked ? 'Unblock rider' : 'Block rider'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowBlockModal(false)}>Cancel</Button>
            <Button
              variant={isBlocked ? 'secondary' : 'danger'}
              size="sm"
              isLoading={blockRider.isPending || unblockRider.isPending}
              onClick={handleBlock}
            >
              {isBlocked ? 'Unblock' : 'Block rider'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {isBlocked
            ? `Are you sure you want to unblock ${rider.name}? They will regain access to accept trips.`
            : `Are you sure you want to block ${rider.name}? They will not be able to accept new trips.`
          }
        </p>
      </Modal>
    </div>
  )
}
