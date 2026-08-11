import type { PointerEvent as ReactPointerEvent } from 'react'
import { useState } from 'react'
import type { ColumnStatus, Task } from '../types/task'

const DRAG_THRESHOLD = 4
const LONG_PRESS_MS = 300
const TOUCH_CANCEL_THRESHOLD = 10

export interface TaskDragState {
  taskId: string
  title: string
  originStatus: ColumnStatus
  x: number
  y: number
  overStatus: ColumnStatus | null
}

export function useTaskMoveDrag(
  getColumnAt: (x: number, y: number) => ColumnStatus | null,
  onMove: (id: string, status: ColumnStatus) => void,
) {
  const [taskDrag, setTaskDrag] = useState<TaskDragState | null>(null)

  const handlePointerDown = (
    e: ReactPointerEvent<HTMLDivElement>,
    task: Task,
  ) => {
    if ((e.target as HTMLElement).closest('button, input')) return

    const startX = e.clientX
    const startY = e.clientY
    const pointerId = e.pointerId
    const target = e.currentTarget
    const isTouch = e.pointerType === 'touch'
    let armed = !isTouch
    let dragging = false
    let longPressTimer: ReturnType<typeof setTimeout> | undefined

    const cleanup = () => {
      if (longPressTimer) clearTimeout(longPressTimer)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleCancel)
    }

    const handleMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const dist = Math.hypot(dx, dy)

      if (!armed) {
        if (dist > TOUCH_CANCEL_THRESHOLD) cleanup()
        return
      }

      if (!dragging && dist > DRAG_THRESHOLD) {
        dragging = true
        target.setPointerCapture(pointerId)
      }
      if (dragging) {
        ev.preventDefault()
        setTaskDrag({
          taskId: task.id,
          title: task.title,
          originStatus: task.status,
          x: ev.clientX,
          y: ev.clientY,
          overStatus: getColumnAt(ev.clientX, ev.clientY),
        })
      }
    }

    const handleUp = (ev: PointerEvent) => {
      cleanup()
      if (dragging) {
        const overStatus = getColumnAt(ev.clientX, ev.clientY)
        if (overStatus && overStatus !== task.status) {
          onMove(task.id, overStatus)
        }
      }
      setTaskDrag(null)
    }

    const handleCancel = () => {
      cleanup()
      setTaskDrag(null)
    }

    if (isTouch) {
      longPressTimer = setTimeout(() => {
        armed = true
      }, LONG_PRESS_MS)
    }

    window.addEventListener('pointermove', handleMove, { passive: false })
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleCancel)
  }

  return { taskDrag, handlePointerDown }
}
