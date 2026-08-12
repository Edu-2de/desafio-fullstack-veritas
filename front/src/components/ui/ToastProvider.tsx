import { useCallback, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { tv } from 'tailwind-variants'
import { ToastContext, type ToastVariant } from './ToastContext'

interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

const TOAST_DURATION_MS = 5000

const toastVariants = tv({
  base: 'pointer-events-auto w-full max-w-sm cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium shadow-lg shadow-ink/10 transition-opacity',
  variants: {
    variant: {
      error: 'border-danger/30 bg-danger text-white',
      success: 'border-status-done/30 bg-status-done text-white',
    },
  },
})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'error') => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => dismiss(id), TOAST_DURATION_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => dismiss(toast.id)}
              className={toastVariants({ variant: toast.variant })}
            >
              {toast.message}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
