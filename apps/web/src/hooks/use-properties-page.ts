import {
  propertiesQueryOptions,
  propertiesStatsQueryOptions,
} from '#/services/query-options/properties'
import type { ListingType, PropertyStatus, PropertyType } from '@crm/shared'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

const EMPTY_STATS = { total: 0, available: 0, reserved: 0, sold: 0, rented: 0 }

export function usePropertiesPage() {
  const [searchText, setSearchText] = useState('')
  const [search] = useDebounce(searchText, 300)
  const [type, setType] = useState<PropertyType>()
  const [status, setStatus] = useState<PropertyStatus>()
  const [listingType, setListingType] = useState<ListingType>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  })

  const { data: properties, isPending } = useQuery(
    propertiesQueryOptions({
      type,
      search,
      status,
      listingType,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
  )

  const { data: stats } = useQuery(propertiesStatsQueryOptions())

  const onTypeChange = (value: PropertyType | 'all') => {
    setType(value === 'all' ? undefined : value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const onStatusChange = (value: PropertyStatus | 'all') => {
    setStatus(value === 'all' ? undefined : value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const onListingTypeChange = (value: ListingType | 'all') => {
    setListingType(value === 'all' ? undefined : value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const onSearchChange = (value: string) => {
    setSearchText(value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  return {
    searchText,
    stats: stats ?? EMPTY_STATS,
    properties: properties?.data ?? [],
    total: properties?.total ?? 0,
    isLoading: isPending,
    pagination,
    setPagination,
    onSearchChange,
    onTypeChange,
    onListingTypeChange,
    onStatusChange,
  }
}
