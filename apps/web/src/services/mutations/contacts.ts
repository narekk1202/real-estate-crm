import { MUTATION_KEYS, QUERY_KEYS } from '#/constants/request-keys'
import type { NewContact } from '@crm/api/src/db/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client } from '../api'

export const useNewContactMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MUTATION_KEYS.NEW_CONTACT],
    mutationFn: async (data: NewContact) => {
      const response = await client.api.contacts.$post({ json: data })
      if (!response.ok) throw new Error('Failed to create contact')
      return await response.json()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACT_STATS] })
      toast.success('Contact created successfully!')
    },
    onError: (error) => {
      console.error('Error creating contact:', error)
      toast.error(`Failed to create contact: ${error.message}`)
    },
  })
}
