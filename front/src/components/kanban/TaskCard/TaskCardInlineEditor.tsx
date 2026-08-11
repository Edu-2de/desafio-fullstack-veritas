import { useEffect, useRef } from 'react'

export interface TaskCardInlineEditorProps {
  title: string
  isEditing: boolean
  onCommit: (value: string) => void
}

export default function TaskCardInlineEditor({
  title,
  isEditing,
  onCommit,
}: TaskCardInlineEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  return (
    <input
      ref={inputRef}
      defaultValue={title}
      onBlur={(e) => onCommit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit(e.currentTarget.value)
        if (e.key === 'Escape') onCommit('')
      }}
      placeholder="Nome da tarefa"
      className="w-full rounded-lg border border-brand/40 px-2.5 py-1.5 text-base font-semibold text-ink outline-none focus:border-brand sm:rounded-md sm:px-2 sm:py-1 sm:text-sm"
    />
  )
}
