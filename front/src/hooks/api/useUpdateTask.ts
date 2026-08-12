import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toTask } from '@/lib/taskMapper'
import type { TaskDTO, TaskWriteDTO } from '@/types/api'
import { useToast } from '@/hooks/useToast'

interface UpdateTaskPayload extends TaskWriteDTO {
  id: string
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateTaskPayload) => {
      const { data } = await api.put<TaskDTO>(`/tasks/${id}`, payload)
      return toTask(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      console.error('Falha ao atualizar tarefa:', error)
      showToast('Não foi possível salvar as alterações. Tente novamente.')
    },
  })
}
