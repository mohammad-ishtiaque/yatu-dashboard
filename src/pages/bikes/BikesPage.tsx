import { useState } from 'react'
import { Search, Plus, Info, Pencil, Trash2, Bike as BikeIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Pagination } from '@/components/ui/Pagination'
import { useBikes, useCreateBike, useUpdateBike, useDeleteBike } from '@/lib/hooks/useBikes'
import type { Bike, BikeStatus } from '@/types'

const LIMIT = 8

const STATUS_TABS: { label: string; value: BikeStatus | 'all' }[] = [
  { label: 'All',         value: 'all'         },
  { label: 'Available',   value: 'available'   },
  { label: 'In Use',      value: 'in_use'      },
  { label: 'Maintenance', value: 'maintenance' },
]

// ─── Bike Form ────────────────────────────────────────────────────────────────
interface BikeFormValues {
  brand: string
  model: string
  plateNumber: string
  color: string
  year: string
  status: BikeStatus
  location: string
}

const defaultBikeForm: BikeFormValues = {
  brand: '', model: '', plateNumber: '', color: '',
  year: new Date().getFullYear().toString(),
  status: 'available', location: '',
}

function BikeFormModal({
  isOpen,
  onClose,
  bike,
  onSave,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  bike?: Bike | null
  onSave: (data: BikeFormValues) => void
  isLoading: boolean
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<BikeFormValues>({
    defaultValues: bike
      ? { brand: bike.brand, model: bike.model, plateNumber: bike.plateNumber, color: bike.color, year: String(bike.year ?? ''), status: bike.status, location: bike.location }
      : defaultBikeForm,
  })

  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bike ? 'Edit Bike' : 'Add New Bike'}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" isLoading={isLoading} onClick={handleSubmit(onSave)}>
            {bike ? 'Save Changes' : 'Add Bike'}
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Brand</label>
          <input placeholder="Boda Boda" className={inputCls} {...register('brand', { required: true })} />
          {errors.brand && <p className="text-xs text-red-500 mt-1">Required</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Model</label>
          <input placeholder="KDA 458 BK" className={inputCls} {...register('model', { required: true })} />
          {errors.model && <p className="text-xs text-red-500 mt-1">Required</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Plate Number</label>
          <input placeholder="A89BT" className={inputCls} {...register('plateNumber', { required: true })} />
          {errors.plateNumber && <p className="text-xs text-red-500 mt-1">Required</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Color</label>
          <input placeholder="Midnight Silver Metallic" className={inputCls} {...register('color', { required: true })} />
          {errors.color && <p className="text-xs text-red-500 mt-1">Required</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Year</label>
          <input type="number" placeholder="2023" className={inputCls} {...register('year')} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
          <select className={inputCls} {...register('status')}>
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
          <input placeholder="Accra Central" className={inputCls} {...register('location')} />
        </div>
      </form>
    </Modal>
  )
}

// ─── Bike Detail Modal ────────────────────────────────────────────────────────
function BikeDetailModal({ bike, onClose }: { bike: Bike; onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Bike Details" size="md"
      footer={<Button size="sm" variant="ghost" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-3">
        {[
          ['Brand',          bike.brand],
          ['Model',          bike.model],
          ['Plate Number',   bike.plateNumber],
          ['Color',          bike.color],
          ['Year',           String(bike.year ?? '—')],
          ['Status',         bike.status],
          ['Location',       bike.location],
          ['Last Service',   bike.lastServiceDate],
          ['Assigned Rider', bike.assignedRider?.name ?? 'No rider assigned'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
            <span className="text-sm text-gray-900 capitalize">{value}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// ─── Table skeleton ───────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          <td className="px-5 py-3.5"><div className="skeleton w-12 h-12 rounded-lg" /></td>
          <td className="px-5 py-3.5"><div className="space-y-1.5"><div className="skeleton h-3 w-24" /><div className="skeleton h-2.5 w-16" /></div></td>
          <td className="px-5 py-3.5"><div className="space-y-1.5"><div className="skeleton h-3 w-20" /><div className="skeleton h-2.5 w-24" /></div></td>
          <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="skeleton w-6 h-6 rounded-full" /><div className="skeleton h-3 w-24" /></div></td>
          <td className="px-5 py-3.5"><div className="skeleton h-5 w-16 rounded-full" /></td>
          <td className="px-5 py-3.5"><div className="flex gap-1"><div className="skeleton w-7 h-7 rounded" /><div className="skeleton w-7 h-7 rounded" /><div className="skeleton w-7 h-7 rounded" /></div></td>
        </tr>
      ))}
    </>
  )
}

export default function BikesPage() {
  const [page,   setPage]   = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BikeStatus | 'all'>('all')

  const [showAdd,    setShowAdd]    = useState(false)
  const [editBike,   setEditBike]   = useState<Bike | null>(null)
  const [viewBike,   setViewBike]   = useState<Bike | null>(null)
  const [deletingBike, setDeletingBike] = useState<Bike | null>(null)

  function handleSearch(v: string) { setSearch(v); setPage(1) }
  function handleStatus(v: BikeStatus | 'all') { setStatus(v); setPage(1) }

  const { data, isLoading, isPlaceholderData } = useBikes({ page, limit: LIMIT, search, status })
  const createBike = useCreateBike()
  const updateBike = useUpdateBike()
  const deleteBike = useDeleteBike()

  async function handleCreate(form: BikeFormValues) {
    await createBike.mutateAsync({
      brand: form.brand, model: form.model, plateNumber: form.plateNumber,
      color: form.color, year: form.year ? Number(form.year) : undefined,
      status: form.status, location: form.location,
      lastServiceDate: new Date().toISOString().split('T')[0],
      assignedRider: null,
    })
    setShowAdd(false)
  }

  async function handleUpdate(form: BikeFormValues) {
    if (!editBike) return
    await updateBike.mutateAsync({
      id: editBike.id,
      payload: {
        brand: form.brand, model: form.model, plateNumber: form.plateNumber,
        color: form.color, year: form.year ? Number(form.year) : undefined,
        status: form.status, location: form.location,
      },
    })
    setEditBike(null)
  }

  async function handleDelete() {
    if (!deletingBike) return
    await deleteBike.mutateAsync(deletingBike.id)
    setDeletingBike(null)
  }

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bike Management</h2>
          <p className="text-sm text-gray-500">{data ? `${data.total} bikes registered` : 'Loading...'}</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm" onClick={() => setShowAdd(true)}>
          Add New Car
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search brand, model, plate..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
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
                {['Car Image', 'Car Brand/Model', 'Bike Plate/Color', 'Assigned Rider', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? <TableSkeleton /> : data?.data.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-400">No bikes match your search.</td></tr>
              ) : data?.data.map(bike => (
                <tr key={bike.id} className="hover:bg-gray-50/50 transition-colors animate-fade-in">
                  {/* Image */}
                  <td className="px-5 py-3.5">
                    <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {bike.imageUrl
                        ? <img src={bike.imageUrl} alt={bike.brand} className="w-full h-full object-cover" />
                        : <BikeIcon className="w-7 h-7 text-red-300" />
                      }
                    </div>
                  </td>
                  {/* Brand / Model */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-900">{bike.brand}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{bike.model}</p>
                  </td>
                  {/* Plate / Color */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-900">Bike Number : {bike.plateNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{bike.color}</p>
                  </td>
                  {/* Assigned rider */}
                  <td className="px-5 py-3.5">
                    {bike.assignedRider ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={bike.assignedRider.name} src={bike.assignedRider.avatarUrl} size="sm" />
                        <span className="text-sm text-gray-700">{bike.assignedRider.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No Driver Assigned To this Bike</span>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-5 py-3.5"><Badge status={bike.status} /></td>
                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewBike(bike)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="View details"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditBike(bike)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingBike(bike)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add modal */}
      <BikeFormModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSave={handleCreate} isLoading={createBike.isPending} />

      {/* Edit modal */}
      {editBike && (
        <BikeFormModal isOpen={true} onClose={() => setEditBike(null)} bike={editBike} onSave={handleUpdate} isLoading={updateBike.isPending} />
      )}

      {/* View detail modal */}
      {viewBike && <BikeDetailModal bike={viewBike} onClose={() => setViewBike(null)} />}

      {/* Delete confirmation */}
      <Modal
        isOpen={Boolean(deletingBike)}
        onClose={() => setDeletingBike(null)}
        title="Delete bike"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeletingBike(null)}>Cancel</Button>
            <Button variant="danger" size="sm" isLoading={deleteBike.isPending} onClick={handleDelete}>
              Delete permanently
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{deletingBike?.brand} {deletingBike?.model}</strong> ({deletingBike?.plateNumber})? This cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
