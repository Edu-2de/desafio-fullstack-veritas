export type ColumnStatus = 'todo' | 'in_progress' | 'done'

export const STATUS_LABEL: Record<ColumnStatus, string> = {
  todo: 'A Fazer',
  in_progress: 'Em Progresso',
  done: 'Concluída',
}

export const COLUMN_ORDER: ColumnStatus[] = ['todo', 'in_progress', 'done']

export interface Task {
  id: string
  status: ColumnStatus
  title: string
  description?: string
  createdAt: string
}

export type statusBadgeVariants = typeof STATUS_LABEL
