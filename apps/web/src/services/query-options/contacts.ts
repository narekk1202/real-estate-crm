import { QUERY_KEYS } from '#/constants/request-keys'
import type { GetAllFilters } from '@crm/shared'
import { queryOptions } from '@tanstack/react-query'
import { client } from '../api'

export const contactsQueryOptions = ({
  search,
  type,
  status,
}: GetAllFilters) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.CONTACTS, search, type, status],
    queryFn: async () => {
      const result = await client.api.contacts.$get({
        query: { search, type, status },
      })

      if (!result.ok) {
        throw new Error('Failed to fetch contacts')
      }

      return await result.json()
    },
  })
}
