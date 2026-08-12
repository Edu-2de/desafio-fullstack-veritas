import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  COLUMN_ORDER,
  STATUS_LABEL,
  type ColumnStatus,
  type Task,
} from '../../types/task'
import Column from './Column'
import TaskCard from './TaskCard/TaskCard'
import TaskCreateCard from './TaskCard/TaskCreateCard'

export interface BoardProps {
  tasks: Task[]
  dragOverStatus: ColumnStatus | null
  taskDragOverStatus: ColumnStatus | null
  draggingTaskId: string | null
  registerColumnRef: (status: ColumnStatus, el: HTMLDivElement | null) => void
  onAddTask: (status: ColumnStatus) => void
  onTaskDragPointerDown: (
    e: ReactPointerEvent<HTMLDivElement>,
    task: Task,
  ) => void
  creatingStatus: ColumnStatus | null
  onCreateTask: (status: ColumnStatus, title: string, description: string) => void
  onCancelCreate: () => void
}

export default function Board({
  tasks,
  dragOverStatus,
  taskDragOverStatus,
  draggingTaskId,
  registerColumnRef,
  onAddTask,
  onTaskDragPointerDown,
  creatingStatus,
  onCreateTask,
  onCancelCreate,
}: BoardProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:gap-5 lg:gap-8">
      {COLUMN_ORDER.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status)

        return (
          <Column
            key={status}
            status={status}
            title={STATUS_LABEL[status]}
            count={columnTasks.length}
            isDragOver={
              dragOverStatus === status || taskDragOverStatus === status
            }
            dropRef={(el) => registerColumnRef(status, el)}
            onAddClick={() => onAddTask(status)}
            createCard={
              status === creatingStatus ? (
                <TaskCreateCard
                  status={status}
                  onCreate={onCreateTask}
                  onCancel={onCancelCreate}
                />
              ) : undefined
            }
          >
            {columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isDragging={draggingTaskId === task.id}
                onDragPointerDown={(e) => onTaskDragPointerDown(e, task)}
              />
            ))}
          </Column>
        )
      })}
    </div>
  )
}
