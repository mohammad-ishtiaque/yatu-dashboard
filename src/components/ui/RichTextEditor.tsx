import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Code, Highlighter, List, ListOrdered, Link as LinkIcon,
  Code2, Quote, Minus, Undo2, Redo2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils/formatters'
import { useCallback, useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  minHeight?: number
}

function ToolbarButton({
  onClick,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded transition-colors text-gray-600',
        isActive
          ? 'bg-red-50 text-red-600'
          : 'hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {children}
    </button>
  )
}

function Separator() {
  return <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />
}

export function RichTextEditor({ content, onChange, minHeight = 400 }: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-red-500 underline' } }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-5 py-4',
        style: `min-height: ${minHeight}px`,
      },
    },
  })

  const addLink = useCallback(() => {
    if (!editor) return
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const HEADING_OPTIONS = [
    { label: 'Normal text', action: () => editor?.chain().focus().setParagraph().run(), isActive: () => editor?.isActive('paragraph') ?? false },
    { label: 'Heading 1',   action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor?.isActive('heading', { level: 1 }) ?? false },
    { label: 'Heading 2',   action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor?.isActive('heading', { level: 2 }) ?? false },
    { label: 'Heading 3',   action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor?.isActive('heading', { level: 3 }) ?? false },
  ]

  const currentHeading = HEADING_OPTIONS.find(o => o.isActive())?.label ?? 'Normal text'

  if (!editor) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
        {/* Undo / Redo */}
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Separator />

        {/* Heading / Text style dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1 h-7 px-2 text-xs text-gray-600 rounded hover:bg-gray-100 transition-colors"
          >
            <span className="max-w-[80px] truncate">{currentHeading}</span>
            <ChevronDown className="w-3 h-3 flex-shrink-0" />
          </button>
          <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block min-w-[140px]">
            {HEADING_OPTIONS.map(opt => (
              <button
                key={opt.label}
                type="button"
                onClick={opt.action}
                className={cn(
                  'w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors',
                  opt.isActive() ? 'text-red-600 font-medium' : 'text-gray-700'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Text alignment */}
        <ToolbarButton title="Align left"    isActive={editor.isActive({ textAlign: 'left' })}    onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft    className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Align center"  isActive={editor.isActive({ textAlign: 'center' })}  onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter  className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Align right"   isActive={editor.isActive({ textAlign: 'right' })}   onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight   className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Justify"       isActive={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify className="w-3.5 h-3.5" /></ToolbarButton>

        <Separator />

        {/* Inline formatting */}
        <ToolbarButton title="Bold"          isActive={editor.isActive('bold')}          onClick={() => editor.chain().focus().toggleBold().run()}><Bold          className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Italic"        isActive={editor.isActive('italic')}        onClick={() => editor.chain().focus().toggleItalic().run()}><Italic        className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Underline"     isActive={editor.isActive('underline')}     onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Strikethrough" isActive={editor.isActive('strike')}        onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough  className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Inline code"   isActive={editor.isActive('code')}          onClick={() => editor.chain().focus().toggleCode().run()}><Code           className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Highlight"     isActive={editor.isActive('highlight')}     onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter   className="w-3.5 h-3.5" /></ToolbarButton>

        <Separator />

        {/* Lists */}
        <ToolbarButton title="Bullet list"   isActive={editor.isActive('bulletList')}   onClick={() => editor.chain().focus().toggleBulletList().run()}><List          className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Ordered list"  isActive={editor.isActive('orderedList')}  onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered   className="w-3.5 h-3.5" /></ToolbarButton>

        <Separator />

        {/* Block elements */}
        <ToolbarButton title="Blockquote"    isActive={editor.isActive('blockquote')}   onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote         className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Code block"    isActive={editor.isActive('codeBlock')}    onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2          className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Divider"       isActive={false}                           onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus         className="w-3.5 h-3.5" /></ToolbarButton>

        <Separator />

        {/* Link */}
        <ToolbarButton
          title="Insert link"
          isActive={editor.isActive('link')}
          onClick={() => setShowLinkInput(v => !v)}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Link input bar */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-blue-50/30">
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addLink(); if (e.key === 'Escape') setShowLinkInput(false) }}
            placeholder="https://example.com"
            className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
          />
          <button type="button" onClick={addLink} className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Add</button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="text-xs px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
        </div>
      )}

      {/* ── Editor content area ── */}
      <EditorContent editor={editor} />
    </div>
  )
}
