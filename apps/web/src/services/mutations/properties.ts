import { MUTATION_KEYS, QUERY_KEYS } from '#/constants/request-keys'
import type { NewProperty } from '@crm/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../api'

export const useNewPropertyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MUTATION_KEYS.NEW_PROPERTY],
    mutationFn: async (data: NewProperty) => {
      const result = await client.api.properties.$post({ json: data })
      if (!result.ok) throw new Error('Failed to create property')
      const json = await result.json()
      return Array.isArray(json) ? json[0] : json
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROPERTIES_STATS],
        }),
      ])
    },
  })
}
