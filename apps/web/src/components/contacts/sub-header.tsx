import {
  contactStatusValues,
  contactTypeValues,
  type ContactStats,
  type ContactStatus,
  type ContactType,
} from '@crm/shared'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

interface SubHeaderProps {
  stats: ContactStats
  search?: string
  onSearchChange?: (value: string) => void
  onTypeChange?: (value: ContactType | 'all') => void
  onStatusChange?: (value: ContactStatus | 'all') => void
}

function SubHeader({
  stats,
  search,
  onTypeChange,
  onSearchChange,
  onStatusChange,
}: Readonly<SubHeaderProps>) {
  const statItems = [
    { label: 'Total', value: stats.total },
    { label: 'Active', value: stats.active },
    { label: 'Leads', value: stats.leads },
    { label: 'Clients', value: stats.clients },
  ]

  return (
    <section className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statItems.map(({ label, value }) => (
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
          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue="all"
          onValueChange={(v) => onTypeChange?.(v as ContactType | 'all')}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {contactTypeValues.map((type) => (
              <TabsTrigger key={type} value={type}>
                {capitalize(type)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs
          defaultValue="all"
          onValueChange={(v) => onStatusChange?.(v as ContactStatus | 'all')}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {contactStatusValues.map((status) => (
              <TabsTrigger key={status} value={status}>
                {capitalize(status)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  )
}

export default SubHeader
