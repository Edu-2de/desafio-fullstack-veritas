import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import IconButton from '../ui/IconButton'
import Text from '../ui/Text'

export interface ModalProps {
  open: boolean
  title?: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
  const [hasOpened, setHasOpened] = useState(open)
  if (open && !hasOpened) setHasOpened(true)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!hasOpened) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-150 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className="absolute inset-0 cursor-default"
      />

      <div
        className={`relative w-full max-w-sm rounded-3xl border border-border/60 bg-surface p-5 shadow-2xl shadow-ink/10 transition-all duration-150 ${
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {title && (
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Text variant="subtitle" className="line-clamp-1">
                {title}
              </Text>
              {description && (
                <Text variant="caption" color="muted" className="mt-0.5 block">
                  {description}
                </Text>
              )}
            </div>
            <IconButton
              icon={X}
              variant="ghost"
              size="sm"
              aria-label="Fechar"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="-mr-1 -mt-1 shrink-0"
            />
          </div>
        )}

        {children}
      </div>
    </div>,
    document.body,
  )
}
