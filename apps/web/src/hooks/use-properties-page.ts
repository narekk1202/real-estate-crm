import { propertiesQueryOptions } from '#/services/query-options/properties'
import type { ListingType, PropertyStatus, PropertyType } from '@crm/shared'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const EMPTY_STATS = { total: 0, available: 0, reserved: 0, soldOrRented: 0 }

export function usePropertiesPage() {
  const [searchText, setSearchText] = useState('')
  const [type, setType] = useState<PropertyType>()
  const [status, setStatus] = useState<PropertyStatus>()
  const [listingType, setListingType] = useState<ListingType>()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: properties, isPending } = useQuery(
    propertiesQueryOptions({
      search: searchText,
      type,
      status,
      listingType,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
  )

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
    stats: properties || EMPTY_STATS,
    properties,
    isLoading: isPending,
    onSearchChange,
    onTypeChange,
    onListingTypeChange,
    onStatusChange,
  }
}
