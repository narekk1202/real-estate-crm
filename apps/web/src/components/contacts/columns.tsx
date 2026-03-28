import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'
import type { Contacts } from '@crm/api/src/db/schemas'
import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Trash } from 'lucide-react'
import { Button } from '../ui/button'
import EditContact from './edit-contact'

export type SerializedContacts = Omit<Contacts, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<SerializedContacts>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => new Date(row.original.createdAt).toDateString(),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type
      return (
        <Badge
          className={cn({
            'bg-blue-100 text-blue-600': type === 'LEAD',
            'bg-green-100 text-green-600': type === 'CLIENT',
            'bg-yellow-100 text-yellow-600': type === 'AGENT',
            'bg-purple-100 text-purple-600': type === 'LANDLORD',
          })}
        >
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          className={cn({
            'bg-green-100 text-green-600': status === 'ACTIVE',
            'bg-yellow-100 text-yellow-600': status === 'POTENTIAL',
            'bg-gray-100 text-gray-600': status === 'INACTIVE',
            'bg-red-100 text-red-600': status === 'ARCHIVED',
          })}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <EditContact row={row} />
        <Button size="icon" variant="destructive">
          <Trash />
        </Button>
      </div>
    ),
  },
]
