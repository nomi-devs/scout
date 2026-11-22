import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Heading2, Italic, Link2, List, ListOrdered, Redo2, Underline, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface Props {
  /** HTML string. */
  value: string
  onChange: (html: string) => void
  label: string
  dir?: 'ltr' | 'rtl'
  invalid?: boolean
}

/** True when the HTML has no visible text, e.g. an empty editor gives `<p></p>`. */
export function isRichTextEmpty(html: string): boolean {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() === ''
}

/** Rich text field (bold, italic, underline, heading, lists, links). Stores HTML. */
export function RichTextEditor({ value, onChange, label, dir = 'ltr', invalid }: Props) {
  const { t } = useTranslation()
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } })],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': label,
        'aria-invalid': invalid ? 'true' : 'false',
        dir,
        class: 'rich-content min-h-32 px-3 py-2 text-sm outline-none',
      },
    },
  })

  if (!editor) return null

  const tools = [
    { key: 'bold', icon: Bold, active: editor.isActive('bold'), run: () => editor.chain().focus().toggleBold().run() },
    {
      key: 'italic',
      icon: Italic,
      active: editor.isActive('italic'),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      key: 'underline',
      icon: Underline,
      active: editor.isActive('underline'),
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      key: 'heading',
      icon: Heading2,
      active: editor.isActive('heading', { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: 'bulletList',
      icon: List,
      active: editor.isActive('bulletList'),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      key: 'orderedList',
      icon: ListOrdered,
      active: editor.isActive('orderedList'),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      key: 'link',
      icon: Link2,
      active: editor.isActive('link'),
      run: () => {
        const previous = editor.getAttributes('link').href as string | undefined
        const url = window.prompt(t('rich.linkPrompt'), previous ?? 'https://')
        if (url === null) return
        if (url.trim() === '') editor.chain().focus().extendMarkRange('link').unsetLink().run()
        else editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
      },
    },
    { key: 'undo', icon: Undo2, active: false, run: () => editor.chain().focus().undo().run() },
    { key: 'redo', icon: Redo2, active: false, run: () => editor.chain().focus().redo().run() },
  ]

  return (
    <div
      className={`bg-input/50 overflow-hidden rounded-xl border ${invalid ? 'border-destructive' : ''}`}
      dir="ltr"
    >
      <div className="bg-muted/40 flex flex-wrap gap-0.5 border-b p-1" role="toolbar" aria-label={label}>
        {tools.map(({ key, icon: Icon, active, run }) => (
          <Button
            key={key}
            type="button"
            size="icon-sm"
            variant={active ? 'secondary' : 'ghost'}
            aria-label={t(`rich.${key}`)}
            aria-pressed={active}
            onMouseDown={(e) => e.preventDefault()}
            onClick={run}
          >
            <Icon />
          </Button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
