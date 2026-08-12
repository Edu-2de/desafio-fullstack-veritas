import { tv } from 'tailwind-variants'
import { COLUMN_ORDER, STATUS_LABEL, type ColumnStatus } from '@/types/task'
import { statusBadgeVariants } from './status'

// Seletor de status reutilizado onde quer que o usuário escolha o status
// de uma task (criar/editar, desktop/mobile) — antes era markup quase
// idêntico copiado em três lugares.
const pickerVariants = tv({
  slots: {
    container: 'flex flex-wrap',
    button: 'cursor-pointer transition-all',
  },
  variants: {
    size: {
      sm: { container: 'gap-1.5', button: 'px-2 py-0.5 text-xs' },
      lg: { container: 'gap-2', button: 'px-3.5 py-2 text-sm' },
    },
    isSelected: {
      true: { button: 'ring-2 ring-current ring-offset-1' },
      false: { button: 'opacity-40 hover:opacity-70 active:opacity-70' },
    },
  },
})

export interface StatusPickerProps {
  value: ColumnStatus
  onChange: (status: ColumnStatus) => void
  size?: 'sm' | 'lg'
}

export default function StatusPicker({
  value,
  onChange,
  size = 'sm',
}: StatusPickerProps) {
  const { container, button } = pickerVariants()

  return (
    <div className={container({ size })}>
      {COLUMN_ORDER.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`${statusBadgeVariants({ status: option })} ${button({ size, isSelected: value === option })}`}
        >
          {STATUS_LABEL[option]}
        </button>
      ))}
    </div>
  )
}
