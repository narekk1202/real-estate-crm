import { columns } from '#/components/contacts/columns'
import SubHeader from '#/components/contacts/sub-header'
import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import { Separator } from '#/components/ui/separator'
import { contactsQueryOptions } from '#/services/query-options/contacts'
import type { ContactStatus, ContactType } from '@crm/shared'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

export const Route = createFileRoute('/dashboard/contacts')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchText, setSearchText] = useState('')
  const [type, setType] = useState<ContactType>()
  const [status, setStatus] = useState<ContactStatus>()
  const [search] = useDebounce(searchText, 300)
  const { data, isLoading } = useQuery(
    contactsQueryOptions({ search, type, status }),
  )

  return (
    <main className="page-wrap space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your leads, clients, agents, and landlords.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            New Contact
          </Button>
        </div>
      </div>

      <Separator />
      <SubHeader
        search={searchText}
        onSearchChange={setSearchText}
        onTypeChange={(type) => setType(type === 'all' ? undefined : type)}
        onStatusChange={(s) => setStatus(s === 'all' ? undefined : s)}
      />
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
    </main>
  )
}
