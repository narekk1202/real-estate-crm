import { Badge } from '#/components/ui/badge'
import type { Contacts } from '@crm/api/src/db/schemas'
import { type ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Contacts>[] = [
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
    header: 'Created At',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type
      return <Badge>{type}</Badge>
    },
  },
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.status
			return <Badge>{status}</Badge>
		},
	}
]
