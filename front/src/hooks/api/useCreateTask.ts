import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toTask } from '@/lib/taskMapper'
import type { TaskDTO, TaskWriteDTO } from '@/types/api'
import { useToast } from '@/hooks/useToast'

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (payload: TaskWriteDTO) => {
      const { data } = await api.post<TaskDTO>('/tasks', payload)
      return toTask(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      console.error('Falha ao criar tarefa:', error)
      showToast('Não foi possível criar a tarefa. Tente novamente.')
    },
  })
}
