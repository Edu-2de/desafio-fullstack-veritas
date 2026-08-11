import { COLUMN_ORDER, STATUS_LABEL, type ColumnStatus } from '@/types/task'
import Button from '@/components/ui/Button'
import { statusBadgeVariants } from '../status'

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
      <div className="flex flex-wrap gap-1.5">
        {COLUMN_ORDER.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onStatusChange(option)}
            className={`${statusBadgeVariants({ status: option })} cursor-pointer px-2 py-0.5 text-xs transition-all ${
              draftStatus === option
                ? 'ring-2 ring-current ring-offset-1'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            {STATUS_LABEL[option]}
          </button>
        ))}
      </div>
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
