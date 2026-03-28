import { QUERY_KEYS } from '#/constants/request-keys'
import { queryOptions } from '@tanstack/react-query'
import { client } from '../api'
import type { GetAllFilters } from '@crm/api/src/routes/contacts/contacts.service'

export const contactsQueryOptions = ({ search }: GetAllFilters) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.CONTACTS, search],
    queryFn: async () => {
      const result = await client.api.contacts.$get({ query: { search } })

      if (!result.ok) {
        throw new Error('Failed to fetch contacts')
      }

      return await result.json()
    },
  })
}
