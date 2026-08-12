import { useState } from 'react'
import { tv } from 'tailwind-variants'
import type { ColumnStatus } from '@/types/task'
import Button from '../ui/Button'
import Text from '../ui/Text'
import StatusPicker from './StatusPicker'

const formVariants = tv({
  slots: {
    label: 'mb-1.5 block text-xs font-medium text-muted',
    input:
      'w-full rounded-xl border border-border px-3.5 py-3 text-base text-ink outline-none transition-colors focus:border-brand',
  },
})

export interface TaskFormProps {
  submitLabel: string
  initialTitle?: string
  initialDescription?: string
  initialStatus?: ColumnStatus
  onCancel: () => void
  onSubmit: (status: ColumnStatus, title: string, description: string) => void
}

export default function TaskForm({
  submitLabel,
  initialTitle = '',
  initialDescription = '',
  initialStatus = 'todo',
  onCancel,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [status, setStatus] = useState(initialStatus)

  const { label, input } = formVariants()

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onSubmit(status, trimmed, description.trim())
    setTitle(initialTitle)
    setDescription(initialDescription)
    setStatus(initialStatus)
  }

  return (
    <>
      <div className="mb-4">
        <label htmlFor="task-title" className={label()}>
          Nome da tarefa
        </label>
        <input
          id="task-title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
          }}
          placeholder="Ex.: Revisar layout do board"
          className={input()}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="task-description" className={label()}>
          Descrição
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes da tarefa (opcional)"
          rows={3}
          className={`${input()} resize-none`}
        />
      </div>

      <div className="mb-5">
        <Text
          variant="caption"
          color="muted"
          className="mb-2 block font-medium"
        >
          Status
        </Text>
        <StatusPicker value={status} onChange={setStatus} size="lg" />
      </div>

      <div className="flex gap-2 border-t border-border pt-4">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          size="lg"
          className="flex-1"
          disabled={!title.trim()}
          onClick={handleSubmit}
        >
          {submitLabel}
        </Button>
      </div>
    </>
  )
}
