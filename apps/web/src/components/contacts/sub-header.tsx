import type { Contacts } from '@crm/api/src/db/schemas'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

const STATS = [
  { label: 'Total', value: '—' },
  { label: 'Active', value: '—' },
  { label: 'Leads', value: '—' },
  { label: 'Clients', value: '—' },
]

const TYPES: Contacts['type'][] = ['AGENT', 'CLIENT', 'LANDLORD', 'LEAD']
const STATUSES: Contacts['status'][] = [
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED',
  'POTENTIAL',
]

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

function SubHeader() {
  return (
    <section className="flex flex-col gap-5">
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
            {TYPES.map((type) => (
              <TabsTrigger key={type} value={type}>
                {capitalize(type)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {STATUSES.map((status) => (
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
