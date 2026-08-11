import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import Icon from './Icon'

const iconButtonVariants = tv({
  base: `
    inline-flex items-center justify-center rounded-lg
    cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
  `,
  variants: {
    variant: {
      primary:
        'bg-brand hover:bg-brand-hover active:bg-brand-active text-white',
      secondary: 'bg-surface border border-border text-ink hover:bg-background',
      ghost: 'bg-transparent text-muted hover:bg-border/60 hover:text-ink',
      dangerGhost: 'bg-transparent text-danger hover:bg-danger/10',
    },
    size: {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'md',
  },
})

const iconSizeBySize = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const

export interface IconButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: LucideIcon
  'aria-label': string
}

export default function IconButton({
  icon,
  variant,
  size = 'md',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      className={iconButtonVariants({ variant, size, className })}
      {...rest}
    >
      <Icon icon={icon} size={iconSizeBySize[size]} color="current" />
    </button>
  )
}
