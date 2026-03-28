import {
  contactsQueryOptions,
  contactStatsQueryOptions,
} from '#/services/query-options/contacts'
import type { ContactStatus, ContactType } from '@crm/shared'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

const EMPTY_STATS = { total: 0, active: 0, leads: 0, clients: 0 }

export function useContactsPage() {
  const [searchText, setSearchText] = useState('')
  const [type, setType] = useState<ContactType>()
  const [status, setStatus] = useState<ContactStatus>()
  const [search] = useDebounce(searchText, 300)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: contacts, isLoading } = useQuery(
    contactsQueryOptions({
      search,
      type,
      status,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
  )

  const { data: stats } = useQuery(contactStatsQueryOptions())

  const onTypeChange = (value: ContactType | 'all') => {
    setType(value === 'all' ? undefined : value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const onStatusChange = (value: ContactStatus | 'all') => {
    setStatus(value === 'all' ? undefined : value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const onSearchChange = (value: string) => {
    setSearchText(value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  return {
    searchText,
    stats: stats ?? EMPTY_STATS,
    contacts: contacts?.data ?? [],
    total: contacts?.total ?? 0,
    isLoading,
    pagination,
    setPagination,
    onSearchChange,
    onTypeChange,
    onStatusChange,
  }
}
