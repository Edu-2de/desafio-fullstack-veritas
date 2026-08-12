import { describe, expect, it } from 'vitest'
import { toTask } from './taskMapper'
import type { TaskDTO } from '../types/api'

describe('toTask', () => {
  it('converte snake_case do backend para o domínio em camelCase', () => {
    const dto: TaskDTO = {
      id: '1',
      title: 'Estudar Go',
      description: 'Ler documentação',
      status: 'todo',
      created_at: '2026-08-11T22:06:48.822Z',
      updated_at: '2026-08-11T22:06:48.822Z',
    }

    expect(toTask(dto)).toEqual({
      id: '1',
      title: 'Estudar Go',
      description: 'Ler documentação',
      status: 'todo',
      createdAt: '2026-08-11',
    })
  })

  it('trata description vazia como undefined', () => {
    const dto: TaskDTO = {
      id: '1',
      title: 'Sem descrição',
      description: '',
      status: 'done',
      created_at: '2026-08-11T00:00:00Z',
      updated_at: '2026-08-11T00:00:00Z',
    }

    expect(toTask(dto).description).toBeUndefined()
  })
})
