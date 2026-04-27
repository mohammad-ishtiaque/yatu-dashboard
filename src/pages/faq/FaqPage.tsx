import { useState } from 'react'
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '@/lib/hooks/useFaq'
import type { FAQ } from '@/types'

interface FaqFormState {
  question: string
  answer: string
}

function FaqCard({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FAQ
  onEdit: (faq: FAQ) => void
  onDelete: (faq: FAQ) => void
}) {
  return (
    <div className="card p-5 flex flex-col gap-3 relative group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <HelpCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug">{faq.question}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(faq)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(faq)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="pl-11">
        <div className="w-6 h-0.5 bg-red-400 rounded mb-2" />
        <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  )
}

function FaqFormModal({
  isOpen,
  onClose,
  initial,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  initial?: FaqFormState
  onSubmit: (data: FaqFormState) => void
  isLoading: boolean
}) {
  const [form, setForm] = useState<FaqFormState>(
    initial ?? { question: '', answer: '' }
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) return
    onSubmit(form)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Edit FAQ' : 'Add New FAQ'}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" isLoading={isLoading} onClick={handleSubmit}>
            {initial ? 'Save Changes' : 'Add FAQ'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Question</label>
          <input
            type="text"
            value={form.question}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            placeholder="Enter the question..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Answer</label>
          <textarea
            value={form.answer}
            onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
            placeholder="Enter the answer..."
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none"
          />
        </div>
      </form>
    </Modal>
  )
}

export default function FaqPage() {
  const { data: faqs = [], isLoading } = useFaqs()
  const createFaq = useCreateFaq()
  const updateFaq = useUpdateFaq()
  const deleteFaq = useDeleteFaq()

  const [showAdd,   setShowAdd]   = useState(false)
  const [editFaq,   setEditFaq]   = useState<FAQ | null>(null)
  const [deletingFaq, setDeletingFaq] = useState<FAQ | null>(null)

  async function handleCreate(data: FaqFormState) {
    await createFaq.mutateAsync(data)
    setShowAdd(false)
  }

  async function handleUpdate(data: FaqFormState) {
    if (!editFaq) return
    await updateFaq.mutateAsync({ id: editFaq.id, payload: data })
    setEditFaq(null)
  }

  async function handleDelete() {
    if (!deletingFaq) return
    await deleteFaq.mutateAsync(deletingFaq.id)
    setDeletingFaq(null)
  }

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
          <p className="text-sm text-gray-500">{faqs.length} frequently asked questions</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm" onClick={() => setShowAdd(true)}>
          Add New FAQ
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-5/6" />
            </div>
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <div className="card p-16 text-center">
          <HelpCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No FAQs yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map(faq => (
            <FaqCard
              key={faq.id}
              faq={faq}
              onEdit={setEditFaq}
              onDelete={setDeletingFaq}
            />
          ))}
        </div>
      )}

      {/* Add modal */}
      <FaqFormModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleCreate}
        isLoading={createFaq.isPending}
      />

      {/* Edit modal */}
      {editFaq && (
        <FaqFormModal
          isOpen={true}
          onClose={() => setEditFaq(null)}
          initial={{ question: editFaq.question, answer: editFaq.answer }}
          onSubmit={handleUpdate}
          isLoading={updateFaq.isPending}
        />
      )}

      {/* Delete confirmation */}
      <Modal
        isOpen={Boolean(deletingFaq)}
        onClose={() => setDeletingFaq(null)}
        title="Delete FAQ"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeletingFaq(null)}>Cancel</Button>
            <Button variant="danger" size="sm" isLoading={deleteFaq.isPending} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this FAQ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
