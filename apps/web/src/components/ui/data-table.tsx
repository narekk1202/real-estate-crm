import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { cn } from '#/lib/utils'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import UniversalPagination from '../shared/universal-pagination'

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

interface DataTableProps<TData, TValue> {
  data: TData[]

  totalCount: number
  isLoading?: boolean
  pagination: PaginationState
  onRowClick?: (row: TData) => void
  columns: ColumnDef<TData, TValue>[]
  onPaginationChange: (pagination: PaginationState) => void
}

export function DataTable<TData, TValue>({
  data,
  columns,
  isLoading,
  pagination,
  totalCount,
  onRowClick,
  onPaginationChange,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const pageCount = Math.ceil(totalCount / pagination.pageSize)

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination, sorting },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater
      onPaginationChange(next)
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Loading...
          </TableCell>
        </TableRow>
      )
    }

    if (rows.length > 0) {
      return rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          onClick={() => onRowClick?.(row.original)}
          className={cn('', onRowClick && 'cursor-pointer')}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id} className="py-3">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))
    }

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          No results.
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div>
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </div>
      <UniversalPagination
        isLoading={isLoading}
        pagination={pagination}
        totalCount={totalCount}
        pageSizeOptions={[10, 25, 50]}
        onPaginationChange={onPaginationChange}
      />
    </div>
  )
}
