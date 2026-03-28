import { QUERY_KEYS } from '#/constants/request-keys'
import type { GetAllFilters } from '@crm/shared'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { client } from '../api'

export const contactsQueryOptions = ({
  search,
  type,
  status,
}: GetAllFilters) => {
  const filters = {
    search: search || undefined,
    type: type || undefined,
    status: status || undefined,
  }

  return queryOptions({
    queryKey: [QUERY_KEYS.CONTACTS, filters],
    queryFn: async () => {
      const result = await client.api.contacts.$get({
        query: filters,
      })

      if (!result.ok) {
        throw new Error('Failed to fetch contacts')
      }

      return await result.json()
    },
    placeholderData: keepPreviousData,
  })
}
