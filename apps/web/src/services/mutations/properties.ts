import { MUTATION_KEYS, QUERY_KEYS } from '#/constants/request-keys'
import type { NewProperty } from '@crm/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client } from '../api'

export const useNewPropertyMutation = () => {
  return useMutation({
    mutationKey: [MUTATION_KEYS.NEW_PROPERTY],
    mutationFn: async (data: NewProperty) => {
      const result = await client.api.properties.$post({ json: data })
      if (!result.ok) throw new Error('Failed to create property')
      const json = await result.json()
      return Array.isArray(json) ? json[0] : json
    },
  })
}

export const useEditPropertyMutation = ({
  propertyId,
}: {
  propertyId: string
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MUTATION_KEYS.EDIT_PROPERTY],
    mutationFn: async (data: NewProperty) => {
      const response = await client.api.properties[':id'].$put({
        json: data,
        param: { id: propertyId },
      })
      if (!response.ok) throw new Error('Failed to update property')
      return await response.json()
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROPERTY, propertyId],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROPERTIES_STATS],
        }),
      ])
      toast.success('Property updated successfully!')
    },
    onError: (error) => {
      console.error('Error updating property:', error)
      toast.error(`Failed to update property: ${error.message}`)
    },
  })
}
