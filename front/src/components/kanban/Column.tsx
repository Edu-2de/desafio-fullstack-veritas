import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import type { ColumnStatus } from '@/types/task'
import Badge from './Badge'
import Text from '../ui/Text'

const dotVariants = tv({
  base: 'size-2.5 rounded-full shrink-0',
  variants: {
    status: {
      todo: 'bg-status-todo',
      in_progress: 'bg-status-progress',
      done: 'bg-status-done',
    },
  },
})

const bodyVariants = tv({
  base: `
    flex flex-col gap-3.5 min-h-24 rounded-2xl border border-border/60
    bg-surface p-3.5 shadow-sm transition-colors
    sm:gap-4 sm:p-4
  `,
  variants: {
    isDragOver: {
      true: 'border-dashed border-brand/50 bg-brand/5 ring-2 ring-brand/20',
      false: '',
    },
  },
})

export interface ColumnProps {
  status: ColumnStatus
  title: string
  count: number
  isDragOver?: boolean
  dropRef?: (el: HTMLDivElement | null) => void
  onAddClick?: () => void
  createCard?: ReactNode
  children: ReactNode
}

export default function Column({
  status,
  title,
  count,
  isDragOver,
  dropRef,
  onAddClick,
  createCard,
  children,
}: ColumnProps) {
  return (
    <div
      ref={dropRef}
      className="flex w-full shrink-0 flex-col sm:w-auto sm:min-w-64 sm:max-w-80 sm:shrink sm:flex-1 lg:min-w-72 lg:max-w-96"
    >
      <div className="mb-4">
        <div className="flex items-center justify-between px-1 pb-2">
          <div className="flex items-center gap-2">
            <span className={dotVariants({ status })} />
            <Text variant="subtitle" as="span">
              {title}
            </Text>
          </div>
          <Badge>{count}</Badge>
        </div>
        <span className="block h-0.75 w-10 rounded-full bg-brand/70 sm:w-full" />
      </div>

      <div className={bodyVariants({ isDragOver })}>
        {createCard}

        {count === 0 && !createCard ? (
          <div className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-dashed border-border py-8 text-center">
            <Text variant="caption" color="muted" className="font-medium">
              Nenhuma tarefa
            </Text>
            <Text variant="caption" color="muted" className="opacity-70">
              Arraste o + até aqui para criar
            </Text>
          </div>
        ) : (
          children
        )}

        {onAddClick && (
          <button
            type="button"
            onClick={onAddClick}
            className="hidden shrink-0 items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted transition-colors sm:flex hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
          >
            <Plus className="size-4" />
            Adicionar tarefa
          </button>
        )}
      </div>
    </div>
  )
}
