import { useState, useEffect } from 'react'
import { ArrowLeft, Save, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { useContentPage, usePublishContent } from '@/lib/hooks/useContent'
import { ROUTES } from '@/constants/routes'

export default function TermsPage() {
  const { data: page, isLoading } = useContentPage('terms_and_conditions')
  const publish = usePublishContent()

  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (page?.content) setContent(page.content)
  }, [page?.content])

  async function handlePublish() {
    await publish.mutateAsync({
      type: 'terms_and_conditions',
      payload: { title: 'Terms and Conditions', content },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4 max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </Link>
          <h2 className="text-lg font-semibold text-gray-900">Terms &amp; condition</h2>
        </div>
        <Button
          leftIcon={saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          size="sm"
          isLoading={publish.isPending}
          onClick={handlePublish}
          className={saved ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          {saved ? 'Published!' : 'Publish'}
        </Button>
      </div>

      {/* Editor */}
      {isLoading ? (
        <div className="card p-6 space-y-3">
          <div className="skeleton h-10 w-full rounded-xl" />
          <div className="skeleton h-64 w-full" />
        </div>
      ) : (
        <RichTextEditor content={content} onChange={setContent} minHeight={500} />
      )}

      {page?.publishedAt && (
        <p className="text-xs text-gray-400 text-right">
          Last published: {new Date(page.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}
