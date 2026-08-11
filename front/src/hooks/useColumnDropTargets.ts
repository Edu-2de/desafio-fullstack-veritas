import { useCallback, useRef } from 'react'
import type { ColumnStatus } from '../types/task'

export function useColumnDropTargets() {
  const columnRefs = useRef(new Map<ColumnStatus, HTMLDivElement>())

  const registerColumnRef = useCallback(
    (status: ColumnStatus, el: HTMLDivElement | null) => {
      if (el) columnRefs.current.set(status, el)
      else columnRefs.current.delete(status)
    },
    [],
  )

  const getColumnAt = useCallback((x: number, y: number): ColumnStatus | null => {
    for (const [status, el] of columnRefs.current) {
      const rect = el.getBoundingClientRect()
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return status
      }
    }
    return null
  }, [])

  return { registerColumnRef, getColumnAt }
}
