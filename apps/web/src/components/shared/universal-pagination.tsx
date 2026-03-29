import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { PaginationState } from '@tanstack/react-table'

const DEFAULT_PAGE_SIZE_OPTIONS = [6, 12, 24] as const

interface UniversalPaginationProps {
  pagination: PaginationState
  totalCount: number
  isLoading?: boolean
  pageSizeOptions?: readonly number[]
  onPaginationChange: (pagination: PaginationState) => void
}

function UniversalPagination({
  pagination,
  totalCount,
  isLoading,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPaginationChange,
}: Readonly<UniversalPaginationProps>) {
  const { pageIndex, pageSize } = pagination
  const pageCount = Math.ceil(totalCount / pageSize) || 1
  const canPrevious = pageIndex > 0
  const canNext = pageIndex < pageCount - 1
  const firstRow = totalCount === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalCount)

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {totalCount === 0
            ? 'No results'
            : `Showing ${firstRow}–${lastRow} of ${totalCount}`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) =>
              onPaginationChange({ pageIndex: 0, pageSize: Number(value) })
            }
          >
            <SelectTrigger className="h-8 w-17">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPaginationChange({ ...pagination, pageIndex: pageIndex - 1 })
          }
          disabled={!canPrevious || isLoading}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {pageIndex + 1} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPaginationChange({ ...pagination, pageIndex: pageIndex + 1 })
          }
          disabled={!canNext || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default UniversalPagination
