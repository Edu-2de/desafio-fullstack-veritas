import { api } from '@/lib/api'
import { toTask } from '@/lib/taskMapper'
import type { TaskDTO } from '@/types/api'
import { useQuery } from '@tanstack/react-query'

export function useGetTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get<TaskDTO[]>('/tasks')
      return data.map(toTask)
    },
  })
}
