import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  className?: string
}

export default function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-border/70 text-ink text-xs font-semibold min-w-5 h-5 px-1.5 ${className}`}
    >
      {children}
    </span>
  )
}
