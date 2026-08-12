import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { isMobileViewport } from '../lib/viewport'
import type { ColumnStatus } from '../types/task'

const DRAG_THRESHOLD = 4

export interface CreatePoint {
  x: number
  y: number
  overStatus: ColumnStatus | null
}

export function useCreateByDrag(
  getColumnAt: (x: number, y: number) => ColumnStatus | null,
  onCreate: (status: ColumnStatus) => void,
) {
  const [drag, setDrag] = useState<CreatePoint | null>(null)
  const [placing, setPlacing] = useState(false)

  const getColumnAtRef = useRef(getColumnAt)
  const onCreateRef = useRef(onCreate)
  useEffect(() => {
    getColumnAtRef.current = getColumnAt
    onCreateRef.current = onCreate
  })

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (isMobileViewport()) return

    e.preventDefault()

    const startX = e.clientX
    const startY = e.clientY
    const pointerId = e.pointerId
    const target = e.currentTarget
    let dragging = false

    const handleMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragging = true
        target.setPointerCapture(pointerId)
      }
      if (dragging) {
        setDrag({
          x: ev.clientX,
          y: ev.clientY,
          overStatus: getColumnAtRef.current(ev.clientX, ev.clientY),
        })
      }
    }

    const handleUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      if (dragging) {
        const overStatus = getColumnAtRef.current(ev.clientX, ev.clientY)
        if (overStatus) onCreateRef.current(overStatus)
        setDrag(null)
      } else {
        setPlacing((p) => !p)
      }
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  useEffect(() => {
    if (!placing) return

    let readyToConfirm = false
    const readyTimer = setTimeout(() => {
      readyToConfirm = true
    }, 0)

    const handleMove = (ev: MouseEvent) => {
      setDrag({
        x: ev.clientX,
        y: ev.clientY,
        overStatus: getColumnAtRef.current(ev.clientX, ev.clientY),
      })
    }

    const handleConfirm = (ev: MouseEvent) => {
      if (!readyToConfirm) return
      const overStatus = getColumnAtRef.current(ev.clientX, ev.clientY)
      if (overStatus) onCreateRef.current(overStatus)
      setPlacing(false)
    }

    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setPlacing(false)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('click', handleConfirm)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(readyTimer)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('click', handleConfirm)
      window.removeEventListener('keydown', handleKeyDown)
      setDrag(null)
    }
  }, [placing])

  return { drag, placing, handlePointerDown }
}
