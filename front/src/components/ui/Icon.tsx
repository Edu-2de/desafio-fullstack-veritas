import type { LucideIcon } from 'lucide-react'
import { tv, type VariantProps } from 'tailwind-variants'

const iconVariants = tv({
  base: 'shrink-0',
  variants: {
    color: {
      ink: 'text-ink',
      muted: 'text-muted',
      brand: 'text-brand',
      danger: 'text-danger',
      white: 'text-white',
      current: 'text-current',
    },
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: {
    color: 'current',
    size: 'md',
  },
})

export interface IconProps extends VariantProps<typeof iconVariants> {
  icon: LucideIcon
  className?: string
}

export default function Icon({
  icon: LucideIconComponent,
  color,
  size,
  className,
}: IconProps) {
  return (
    <LucideIconComponent className={iconVariants({ color, size, className })} />
  )
}
