import { QUERY_KEYS } from '#/constants/request-keys'
import type { GetAllFilters } from '@crm/shared'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { client } from '../api'

export const contactsQueryOptions = ({
  search,
  type,
  status,
  page,
  pageSize,
}: GetAllFilters) => {
  const filters = {
    search: search || undefined,
    type: type || undefined,
    status: status || undefined,
    page: page ? String(page) : undefined,
    pageSize: pageSize ? String(pageSize) : undefined,
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

export const contactStatsQueryOptions = () => {
  return queryOptions({
    queryKey: [QUERY_KEYS.CONTACT_STATS],
    queryFn: async () => {
      const result = await client.api.contacts.stats.$get()

      if (!result.ok) {
        throw new Error('Failed to fetch contact stats')
      }

      return await result.json()
    },
  })
}
