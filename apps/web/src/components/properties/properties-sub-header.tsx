import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  listingTypeValues,
  propertyStatusValues,
  propertyTypeValues,
  type ListingType,
  type PropertyStats,
  type PropertyStatus,
  type PropertyType,
} from '@crm/shared'
import { Search } from 'lucide-react'

interface PropertiesSubHeaderProps {
  stats: PropertyStats
  search?: string
  onSearchChange?: (value: string) => void
  onTypeChange?: (value: PropertyType | 'all') => void
  onListingTypeChange?: (value: ListingType | 'all') => void
  onStatusChange?: (value: PropertyStatus | 'all') => void
}

function PropertiesSubHeader({
  stats,
  search,
  onSearchChange,
  onTypeChange,
  onListingTypeChange,
  onStatusChange,
}: Readonly<PropertiesSubHeaderProps>) {
  const statItems = [
    { label: 'Total', value: stats.total },
    { label: 'Available', value: stats.available },
    { label: 'Reserved', value: stats.reserved },
    { label: 'Sold / rented', value: stats.sold + stats.rented },
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
            placeholder="Search by address, title..."
            className="pl-8"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            defaultValue="all"
            onValueChange={(v) => onTypeChange?.(v as PropertyType | 'all')}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {propertyTypeValues.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            onValueChange={(v) =>
              onListingTypeChange?.(v as ListingType | 'all')
            }
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="All listings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All listings</SelectItem>
              {listingTypeValues.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            onValueChange={(v) => onStatusChange?.(v as PropertyStatus | 'all')}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {propertyStatusValues.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === 'OFF_MARKET'
                    ? 'Off market'
                    : status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}

export default PropertiesSubHeader
