import { tv } from 'tailwind-variants'
import type { ColumnStatus } from '@/types/task'

export const statusBadgeVariants = tv({
  base: 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
  variants: {
    status: {
      todo: 'bg-status-todo/12 text-status-todo',
      in_progress: 'bg-status-progress/25 text-ink',
      done: 'bg-status-done/12 text-status-done',
    } satisfies Record<ColumnStatus, string>,
  },
})
