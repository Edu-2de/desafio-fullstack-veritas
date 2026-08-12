import { useContext } from 'react'
import { ToastContext } from '@/components/ui/ToastContext'

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast precisa ser usado dentro de um ToastProvider')
  }
  return ctx
}
