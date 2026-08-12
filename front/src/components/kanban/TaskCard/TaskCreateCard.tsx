import { useState } from 'react'
import { tv } from 'tailwind-variants'
import type { ColumnStatus } from '@/types/task'
import Button from '../../ui/Button'
import StatusPicker from '../StatusPicker'

const cardVariants = tv({
  base: `
    flex flex-col gap-3 rounded-2xl border border-brand/40 bg-surface p-4
    shadow-sm sm:rounded-xl sm:gap-3.5 sm:p-5
  `,
})

export interface TaskCreateCardProps {
  status: ColumnStatus
  onCreate: (status: ColumnStatus, title: string, description: string) => void
  onCancel: () => void
}

// Card inline usado no desktop para criar uma task direto na coluna, sem
// modal: aparece no lugar de um card comum, com o status da coluna que
// disparou a criação já pré-selecionado (mas ainda ajustável).
export default function TaskCreateCard({
  status,
  onCreate,
  onCancel,
}: TaskCreateCardProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(status)

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate(selectedStatus, trimmed, description.trim())
  }

  return (
    <div className={cardVariants()}>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSave()
          }
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="Nome da tarefa"
        className="w-full rounded-md border border-brand/40 px-2 py-1.5 text-sm font-semibold text-ink outline-none focus:border-brand"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="Descrição (opcional)"
        rows={2}
        className="w-full resize-none rounded-md border border-border px-2 py-1.5 text-sm text-ink outline-none focus:border-brand"
      />
      <StatusPicker value={selectedStatus} onChange={setSelectedStatus} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" disabled={!title.trim()} onClick={handleSave}>
          Criar
        </Button>
      </div>
    </div>
  )
}
