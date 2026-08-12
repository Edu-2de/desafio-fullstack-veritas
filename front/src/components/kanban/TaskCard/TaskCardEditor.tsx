import type { ColumnStatus } from '@/types/task'
import Button from '@/components/ui/Button'
import StatusPicker from '../StatusPicker'

export interface TaskCardEditorProps {
  draftTitle: string
  draftStatus: ColumnStatus
  onTitleChange: (value: string) => void
  onStatusChange: (status: ColumnStatus) => void
  onSave: () => void
  onCancel: () => void
}

export default function TaskCardEditor({
  draftTitle,
  draftStatus,
  onTitleChange,
  onStatusChange,
  onSave,
  onCancel,
}: TaskCardEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        autoFocus
        value={draftTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="Nome da tarefa"
        className="w-full rounded-md border border-brand/40 px-2 py-1.5 text-sm font-semibold text-ink outline-none focus:border-brand"
      />
      <StatusPicker value={draftStatus} onChange={onStatusChange} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" disabled={!draftTitle.trim()} onClick={onSave}>
          Salvar
        </Button>
      </div>
    </div>
  )
}
