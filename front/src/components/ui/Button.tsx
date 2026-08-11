import type { ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: `
    inline-flex items-center justify-center gap-2 rounded-lg font-medium
    cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
  `,
  variants: {
    variant: {
      primary:
        'bg-brand hover:bg-brand-hover active:bg-brand-active text-white',
      secondary: 'bg-surface border border-border text-ink hover:bg-background',
      outline:
        'bg-transparent border border-brand text-brand hover:bg-brand/10',
      ghost: 'bg-transparent text-ink hover:bg-border/60',
      danger: 'bg-danger hover:bg-danger-hover text-white',
      dangerGhost: 'bg-transparent text-danger hover:bg-danger/10',
    },
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export default function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...rest}>
      {children}
    </button>
  )
}
