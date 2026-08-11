import { Pencil, Trash2 } from 'lucide-react'
import { formatDisplayDate } from '@/lib/date'
import { STATUS_LABEL, type ColumnStatus } from '@/types/task'
import Icon from '@/components/ui/Icon'
import Text from '@/components/ui/Text'
import Modal from '../Modal'

export interface TaskCardMobileActionsProps {
  open: boolean
  title: string
  status: ColumnStatus
  createdAt: string
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function TaskCardMobileActions({
  open,
  title,
  status,
  createdAt,
  onClose,
  onEdit,
  onDelete,
}: TaskCardMobileActionsProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={`${STATUS_LABEL[status]} · ${formatDisplayDate(createdAt)}`}
    >
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => {
            onClose()
            onEdit()
          }}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors active:bg-background"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background">
            <Icon icon={Pencil} size="sm" color="muted" />
          </span>
          <Text variant="body" className="font-medium">
            Editar tarefa
          </Text>
        </button>
        <button
          type="button"
          onClick={() => {
            onClose()
            onDelete()
          }}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors active:bg-danger/10"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-danger/10">
            <Icon icon={Trash2} size="sm" color="danger" />
          </span>
          <Text variant="body" className="font-medium" color="danger">
            Excluir tarefa
          </Text>
        </button>
      </div>
    </Modal>
  )
}
