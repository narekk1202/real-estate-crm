import { columns } from '#/components/contacts/columns'
import SubHeader from '#/components/contacts/sub-header'
import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import { Separator } from '#/components/ui/separator'
import { useContactsPage } from '#/hooks/use-contacts-page'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/dashboard/contacts')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    total,
    stats,
    contacts,
    isLoading,
    pagination,
    searchText,
    onTypeChange,
    setPagination,
    onSearchChange,
    onStatusChange,
  } = useContactsPage()

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
        stats={stats}
        onSearchChange={onSearchChange}
        onTypeChange={onTypeChange}
        onStatusChange={onStatusChange}
      />
      <DataTable
        columns={columns}
        data={contacts || []}
        isLoading={isLoading}
        totalCount={total || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </main>
  )
}
