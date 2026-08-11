import type { ElementType, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const textVariants = tv({
  base: '',
  variants: {
    variant: {
      title: 'text-2xl font-bold',
      subtitle: 'text-lg font-semibold',
      body: 'text-base',
      caption: 'text-sm',
    },
    color: {
      ink: 'text-ink',
      brand: 'text-brand',
      muted: 'text-muted',
      danger: 'text-danger',
      white: 'text-white',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'ink',
  },
})

const defaultElement: Record<
  NonNullable<VariantProps<typeof textVariants>['variant']>,
  ElementType
> = {
  title: 'h1',
  subtitle: 'h2',
  body: 'p',
  caption: 'span',
}

export interface TextProps extends VariantProps<typeof textVariants> {
  as?: ElementType
  className?: string
  children: ReactNode
}

export default function Text({
  variant = 'body',
  color,
  as,
  className,
  children,
}: TextProps) {
  const Component = as ?? defaultElement[variant]

  return (
    <Component className={textVariants({ variant, color, className })}>
      {children}
    </Component>
  )
}
