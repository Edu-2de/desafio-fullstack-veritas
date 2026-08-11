import type { ColumnStatus } from './task'

export interface TaskDTO {
  id: string
  title: string
  description: string
  status: ColumnStatus
  created_at: string
  updated_at: string
}

export interface TaskWriteDTO {
  title: string
  description?: string
  status: ColumnStatus
}
