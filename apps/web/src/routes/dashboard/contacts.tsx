import { columns } from '#/components/contacts/columns'
import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { contactsQueryOptions } from '#/services/query-options/contacts'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Search } from 'lucide-react'

export const Route = createFileRoute('/dashboard/contacts')({
  component: RouteComponent,
})

const STATS = [
  { label: 'Total', value: '—' },
  { label: 'Active', value: '—' },
  { label: 'Leads', value: '—' },
  { label: 'Clients', value: '—' },
]

function RouteComponent() {
  const { data, isLoading } = useQuery(contactsQueryOptions())

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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map(({ label, value }) => (
          <div key={label} className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              {label}
            </p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
          <Input placeholder="Search contacts..." className="pl-8" />
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="lead">Lead</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="landlord">Landlord</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
    </main>
  )
}
