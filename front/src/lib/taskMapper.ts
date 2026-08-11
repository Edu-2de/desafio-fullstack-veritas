import type { TaskDTO } from '../types/api'
import type { Task } from '../types/task'
import { toDateOnly } from './date'

export function toTask(dto: TaskDTO): Task {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description || undefined,
    status: dto.status,
    createdAt: toDateOnly(dto.created_at),
  }
}
