import { QUERY_KEYS } from '#/constants/request-keys'
import type { GetAllContactsFilters } from '@crm/shared'
import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
} from '@tanstack/react-query'
import { client } from '../api'

export const contactsQueryOptions = ({
  search,
  type,
  status,
  page,
  pageSize,
}: GetAllContactsFilters) => {
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
      const result = await client.api.contacts.$get({ query: filters })

      if (!result.ok) {
        throw new Error('Failed to fetch contacts')
      }

      return await result.json()
    },
    placeholderData: keepPreviousData,
  })
}

export const contactsInfiniteQueryOptions = (search?: string) =>
  infiniteQueryOptions({
    queryKey: [QUERY_KEYS.CONTACTS, 'infinite', { search }],
    queryFn: async ({ pageParam }) => {
      const result = await client.api.contacts.$get({
        query: {
          search: search || undefined,
          page: String(pageParam),
          pageSize: '10',
        },
      })
      if (!result.ok) throw new Error('Failed to fetch contacts')
      return await result.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0)
      return loaded < lastPage.total ? allPages.length + 1 : undefined
    },
    placeholderData: keepPreviousData,
  })

export const contactsStatsQueryOptions = () => {
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

export const contactByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.CONTACT, id],
    queryFn: async () => {
      const result = await client.api.contacts[':id'].$get({
        param: { id },
      })

      if (!result.ok) {
        throw new Error('Failed to fetch contact')
      }

      return await result.json()
    },
  })
}
