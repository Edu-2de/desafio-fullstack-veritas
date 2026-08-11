import Icon from '@/components/ui/Icon'
import IconButton from '@/components/ui/IconButton'
import Text from '@/components/ui/Text'
import { useDeleteTask } from '@/hooks/api/useDeleteTask'
import { useUpdateTask } from '@/hooks/api/useUpdateTask'
import { formatDisplayDate } from '@/lib/date'
import { STATUS_LABEL, type Task } from '@/types/task'
import { Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useState } from 'react'
import { tv } from 'tailwind-variants'
import ConfirmDialog from '../ConfirmDialog'
import { statusBadgeVariants } from '../status'
import TaskFormSheet from '../TaskFormSheet'
import TaskCardEditor from './TaskCardEditor'
import TaskCardMobileActions from './TaskCardMobileActions'

const cardVariants = tv({
  base: `
    group flex touch-none flex-col gap-3 rounded-2xl border border-border/70 bg-surface p-4
    shadow-sm transition-all active:shadow-md active:scale-[0.99]
    sm:rounded-xl sm:cursor-grab sm:gap-3.5 sm:p-5 sm:active:scale-100 sm:active:cursor-grabbing
    sm:hover:-translate-y-0.5 sm:hover:border-brand/20 sm:hover:shadow-md
  `,
  variants: {
    isDragging: {
      true: 'opacity-40 sm:hover:translate-y-0 sm:hover:shadow-sm',
      false: '',
    },
  },
})

export interface TaskCardProps {
  task: Task
  isDragging?: boolean
  onDragPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void
}

export default function TaskCard({
  task,
  isDragging = false,
  onDragPointerDown,
}: TaskCardProps) {
  const { mutate: updateTask } = useUpdateTask()
  const { mutate: deleteTask } = useDeleteTask()

  const [actionsOpen, setActionsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [desktopEditing, setDesktopEditing] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftStatus, setDraftStatus] = useState(task.status)

  const handleSaveDesktopEdit = () => {
    const trimmed = draftTitle.trim()
    if (!trimmed) return
    updateTask({
      id: task.id,
      title: trimmed,
      description: task.description,
      status: draftStatus,
    })
    setDesktopEditing(false)
  }

  const renderCardHeader = () => (
    <div className="flex items-start justify-between gap-2">
      <Text variant="body" className="font-semibold leading-snug">
        {task.title}
      </Text>
      <IconButton
        aria-label=""
        icon={MoreVertical}
        variant="ghost"
        size="sm"
        onClick={() => setActionsOpen(true)}
        className="-mr-1 -mt-1 shrink-0 p-2 active:scale-90 sm:hidden"
      />
      {/*
        Sempre visível (não escondido até :hover): em telas sm/md, muitos
        dispositivos são touch e nunca disparam hover, então esconder até
        hover os deixaria sem como editar/excluir.
      */}
      <div className="hidden shrink-0 gap-0.5 sm:flex">
        <IconButton
          aria-label=""
          icon={Pencil}
          variant="ghost"
          size="sm"
          onClick={() => {
            setDraftTitle(task.title)
            setDraftStatus(task.status)
            setDesktopEditing(true)
          }}
        />
        <IconButton
          aria-label=""
          icon={Trash2}
          variant="dangerGhost"
          size="sm"
          onClick={() => setConfirmDeleteOpen(true)}
        />
      </div>
    </div>
  )

  return (
    <div
      className={cardVariants({ isDragging })}
      onPointerDown={desktopEditing ? undefined : onDragPointerDown}
    >
      {desktopEditing ? (
        <TaskCardEditor
          draftTitle={draftTitle}
          draftStatus={draftStatus}
          onTitleChange={setDraftTitle}
          onStatusChange={setDraftStatus}
          onSave={handleSaveDesktopEdit}
          onCancel={() => setDesktopEditing(false)}
        />
      ) : (
        renderCardHeader()
      )}

      {task.description && !desktopEditing && (
        <Text variant="caption" color="muted" className="line-clamp-2">
          {task.description}
        </Text>
      )}

      {!desktopEditing && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-1.5">
          <span
            className={`${statusBadgeVariants({ status: task.status })} px-2.5 py-1 text-[13px] sm:px-2 sm:py-0.5 sm:text-xs`}
          >
            {STATUS_LABEL[task.status]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-[13px] text-muted sm:px-2 sm:py-0.5 sm:text-xs">
            <Icon icon={Calendar} size="sm" color="muted" />
            {formatDisplayDate(task.createdAt)}
          </span>
        </div>
      )}

      <TaskCardMobileActions
        open={actionsOpen}
        title={task.title}
        status={task.status}
        createdAt={task.createdAt}
        onClose={() => setActionsOpen(false)}
        onEdit={() => setEditOpen(true)}
        onDelete={() => {
          setActionsOpen(false)
          setConfirmDeleteOpen(true)
        }}
      />

      <TaskFormSheet
        open={editOpen}
        heading="Editar tarefa"
        submitLabel="Salvar"
        initialTitle={task.title}
        initialDescription={task.description}
        initialStatus={task.status}
        onClose={() => setEditOpen(false)}
        onSubmit={(newStatus, newTitle, newDescription) => {
          updateTask({
            id: task.id,
            status: newStatus,
            title: newTitle,
            description: newDescription,
          })
          setEditOpen(false)
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Excluir tarefa?"
        description={`"${task.title}" será removida permanentemente.`}
        confirmLabel="Excluir"
        onConfirm={() => {
          setConfirmDeleteOpen(false)
          deleteTask(task.id)
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  )
}
