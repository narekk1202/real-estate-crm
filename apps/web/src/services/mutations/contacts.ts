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
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTACT_STATS],
      })
      toast.success('Contact created successfully!')
    },
    onError: (error) => {
      console.error('Error creating contact:', error)
      toast.error(`Failed to create contact: ${error.message}`)
    },
  })
}

export const useEditContactMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MUTATION_KEYS.EDIT_CONTACT],
    mutationFn: async ({ id, data }: { id: string; data: NewContact }) => {
      const response = await client.api.contacts[':id'].$put({
        json: data,
        param: { id },
      })
      if (!response.ok) throw new Error('Failed to edit contact')
      return await response.json()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTACT_STATS],
      })
      toast.success('Contact edited successfully!')
    },
    onError: (error) => {
      console.error('Error editing contact:', error)
      toast.error(`Failed to edit contact: ${error.message}`)
    },
  })
}

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_CONTACT],
    mutationFn: async (id: string) => {
      const response = await client.api.contacts[':id'].$delete({
        param: { id },
      })
      if (!response.ok) throw new Error('Failed to delete contact')
      return await response.json()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTACT_STATS],
      })
      toast.success('Contact deleted successfully!')
    },
    onError: (error) => {
      console.error('Error deleting contact:', error)
      toast.error(`Failed to delete contact: ${error.message}`)
    },
  })
}
