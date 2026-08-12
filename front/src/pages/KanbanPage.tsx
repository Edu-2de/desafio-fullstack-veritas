import { StickyNotePlus } from 'lucide-react'
import { useState } from 'react'
import { tv } from 'tailwind-variants'
import Board from '../components/kanban/Board'
import Header from '../components/kanban/Header'
import TaskFormSheet from '../components/kanban/TaskFormSheet'
import Text from '../components/ui/Text'
import { useCreateTask } from '../hooks/api/useCreateTask'
import { useGetTasks } from '../hooks/api/useGetTasks'
import { useUpdateTask } from '../hooks/api/useUpdateTask'
import { useColumnDropTargets } from '../hooks/useColumnDropTargets'
import { useCreateByDrag } from '../hooks/useCreateByDrag'
import { useTaskMoveDrag } from '../hooks/useTaskMoveDrag'
import { isMobileViewport } from '../lib/viewport'
import type { ColumnStatus } from '../types/task'

const pageVariants = tv({
  slots: {
    container:
      'px-4 sm:px-6 lg:px-8 pt-5 sm:pt-32 pb-24 sm:pb-8 sm:mx-auto sm:max-w-330',
    mobileHeader:
      'mb-5 flex items-center justify-between border-b border-border pb-4 sm:hidden',
    dragTooltip:
      'pointer-events-none fixed z-50 flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 text-white shadow-lg shadow-brand/30',
    taskDragTooltip:
      'pointer-events-none fixed z-50 max-w-64 rounded-xl border border-border bg-surface px-3.5 py-2.5 shadow-lg shadow-ink/10',
  },
})

export default function KanbanPage() {
  const { data: tasks = [], isLoading, isError, refetch } = useGetTasks()
  const { mutate: createTask } = useCreateTask()
  const { mutate: updateTask } = useUpdateTask()

  const [creatingStatus, setCreatingStatus] = useState<ColumnStatus | null>(
    null,
  )
  const [mobileCreateOpen, setMobileCreateOpen] = useState(false)

  const { container, mobileHeader, dragTooltip, taskDragTooltip } =
    pageVariants()

  const handleMoveTask = (id: string, status: ColumnStatus) => {
    const task = tasks.find((t) => t.id === id)
    if (task && task.status !== status) {
      updateTask({
        id,
        title: task.title,
        description: task.description,
        status,
      })
    }
  }

  const handleCreateTask = (
    status: ColumnStatus,
    title: string,
    description: string,
  ) => {
    createTask({ title, description, status })
    setCreatingStatus(null)
  }

  const handleMobileCreate = (
    status: ColumnStatus,
    title: string,
    description: string,
  ) => {
    createTask({ title, description, status })
    setMobileCreateOpen(false)
  }

  const { registerColumnRef, getColumnAt } = useColumnDropTargets()
  const {
    drag,
    placing,
    handlePointerDown: handleCreatePointerDown,
  } = useCreateByDrag(getColumnAt, setCreatingStatus)
  const { taskDrag, handlePointerDown: handleTaskDragPointerDown } =
    useTaskMoveDrag(getColumnAt, handleMoveTask)

  const handleCreateClick = () => {
    if (isMobileViewport()) setMobileCreateOpen(true)
  }

  return (
    <div className="min-h-screen">
      <Header
        onCreatePointerDown={handleCreatePointerDown}
        onCreateClick={handleCreateClick}
        isDragging={!!drag}
        isPlacing={placing}
      />

      <main className="overflow-x-auto">
        <div className={container()}>
          <div className={mobileHeader()}>
            <Text variant="title" color="brand" className="text-xl">
              Mini Kanban
            </Text>
          </div>

          {isError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Text variant="body" color="muted">
                Não foi possível carregar as tarefas. Verifique se o servidor
                está rodando.
              </Text>
              <button
                type="button"
                onClick={() => refetch()}
                className="cursor-pointer text-sm font-semibold text-brand hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Text variant="body" color="muted">
                Carregando tarefas...
              </Text>
            </div>
          ) : (
            <Board
              tasks={tasks}
              dragOverStatus={drag?.overStatus ?? null}
              taskDragOverStatus={taskDrag?.overStatus ?? null}
              draggingTaskId={taskDrag?.taskId ?? null}
              registerColumnRef={registerColumnRef}
              onAddTask={setCreatingStatus}
              onTaskDragPointerDown={handleTaskDragPointerDown}
              creatingStatus={creatingStatus}
              onCreateTask={handleCreateTask}
              onCancelCreate={() => setCreatingStatus(null)}
            />
          )}
        </div>
      </main>

      {drag && (
        <div
          className={dragTooltip()}
          style={{
            left: drag.x,
            top: drag.y,
            transform: 'translate(-50%, -130%)',
          }}
        >
          <StickyNotePlus className="size-4" />
          <Text variant="caption" color="white" className="font-semibold">
            Nova tarefa
          </Text>
        </div>
      )}

      {taskDrag && (
        <div
          className={taskDragTooltip()}
          style={{
            left: taskDrag.x,
            top: taskDrag.y,
            transform: 'translate(-50%, -50%) rotate(-2deg)',
          }}
        >
          <Text variant="body" className="font-semibold line-clamp-1">
            {taskDrag.title}
          </Text>
        </div>
      )}

      <TaskFormSheet
        open={mobileCreateOpen}
        heading="Nova tarefa"
        submitLabel="Criar"
        onClose={() => setMobileCreateOpen(false)}
        onSubmit={handleMobileCreate}
      />
    </div>
  )
}
