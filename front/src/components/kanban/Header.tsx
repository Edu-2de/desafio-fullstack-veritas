import { MousePointer2, StickyNotePlus } from 'lucide-react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { tv } from 'tailwind-variants'
import Text from '../ui/Text'

const toolButtonVariants = tv({
  base: `
    flex items-center justify-center size-9 rounded-lg cursor-pointer transition-colors
    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
  `,
  variants: {
    active: {
      true: 'bg-brand/10 text-brand',
      false: 'text-muted hover:bg-border/60 hover:text-ink',
    },
  },
  defaultVariants: {
    active: false,
  },
})

export interface HeaderProps {
  onCreatePointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => void
  onCreateClick: () => void
  isDragging: boolean
  isPlacing: boolean
}

export default function Header({
  onCreatePointerDown,
  onCreateClick,
  isDragging,
  isPlacing,
}: HeaderProps) {
  return (
    <header
      className={`
        fixed inset-x-0 bottom-0 z-40 flex h-16 w-full items-center
        justify-center gap-3 border-t border-border bg-surface
        sm:bottom-auto sm:top-3 sm:mx-auto sm:h-auto sm:w-fit sm:justify-start
        sm:gap-3 sm:rounded-xl sm:border sm:border-border/60 sm:bg-surface/95
        sm:px-3 sm:py-2 sm:shadow-md sm:shadow-ink/5 sm:backdrop-blur-sm
      `}
    >
      <Text
        variant="body"
        color="brand"
        className="hidden pr-1 text-sm font-semibold sm:block"
      >
        Mini Kanban
      </Text>

      <button
        type="button"
        className={toolButtonVariants({ active: true })}
        aria-label="Ferramenta de seleção"
      >
        <MousePointer2 className="size-4" />
      </button>

      <div className="h-8 w-px bg-border sm:hidden" />

      <button
        type="button"
        onPointerDown={onCreatePointerDown}
        onClick={onCreateClick}
        aria-label="Criar nova tarefa"
        title="Arraste até uma coluna, ou clique e depois clique numa coluna"
        className={`
          flex size-9 items-center justify-center rounded-lg text-brand
          cursor-pointer touch-none select-none transition-all
          hover:text-brand-hover active:scale-90
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
          ${isPlacing ? 'bg-brand/10' : ''}
          ${isDragging ? 'scale-90' : ''}
        `}
      >
        <StickyNotePlus className="size-5" />
      </button>
    </header>
  )
}
