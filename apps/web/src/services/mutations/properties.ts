import { MUTATION_KEYS, QUERY_KEYS } from '#/constants/request-keys'
import type { NewProperty } from '@crm/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../api'
import { toast } from 'sonner'

export const useNewPropertyMutation = () => {
  const queryClient = useQueryClient()
	
	return useMutation({
    mutationKey: [MUTATION_KEYS.NEW_PROPERTY],
    mutationFn: async (data: NewProperty) => {
      const result = await client.api.properties.$post({ json: data })
			if (!result.ok) throw new Error('Failed to create property')
			return await result.json()
    },
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] }),
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES_STATS] }),
			])
			toast.success('Property created successfully')
		},
		onError: (error) => {
			toast.error((error as Error).message || 'Failed to create property')
		}
  })
}
