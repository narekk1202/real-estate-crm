import { QUERY_KEYS } from '#/constants/request-keys'
import type { GetAllPropertiesFilters } from '@crm/shared'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { client } from '../api'

export const propertiesQueryOptions = ({
  type,
  page,
  search,
  status,
  pageSize,
  listingType,
}: GetAllPropertiesFilters) => {
  const filters = {
    search: search || undefined,
    type: type || undefined,
    status: status || undefined,
    listingType: listingType || undefined,
    page: page ? String(page) : undefined,
    pageSize: pageSize ? String(pageSize) : undefined,
  }

  return queryOptions({
    queryKey: [QUERY_KEYS.PROPERTIES, filters],
    queryFn: async () => {
      const result = await client.api.properties.$get({ query: filters })

      if (!result.ok) throw new Error('Failed to fetch properties')

      return await result.json()
    },
    placeholderData: keepPreviousData,
  })
}

export const propertiesStatsQueryOptions = () => {
  return queryOptions({
    queryKey: [QUERY_KEYS.PROPERTIES_STATS],
    queryFn: async () => {
      const result = await client.api.properties.stats.$get()

      if (!result.ok) {
        throw new Error('Failed to fetch property stats')
      }

      return await result.json()
    },
  })
}

export const propertyByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.PROPERTY, id],
    queryFn: async () => {
      const result = await client.api.properties[':id'].$get({
        param: { id },
      })

      if (!result.ok) throw new Error('Failed to fetch property')

      return await result.json()
    },
  })
}
