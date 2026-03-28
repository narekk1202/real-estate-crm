import { QUERY_KEYS } from '#/constants/request-keys'
import { queryOptions } from '@tanstack/react-query'
import { client } from '../api'

export const contactsQueryOptions = () => {
  return queryOptions({
    queryKey: [QUERY_KEYS.CONTACTS],
    queryFn: async () => {
      const result = await client.api.contacts.$get({ query: {} })

      if (!result.ok) {
        throw new Error('Failed to fetch contacts')
      }

      return await result.json()
    },
  })
}
