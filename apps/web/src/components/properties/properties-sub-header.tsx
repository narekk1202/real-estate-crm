import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Search } from 'lucide-react'
import type { ListingType, PropertyStatus, PropertyType } from './property-card'

export interface PropertyStats {
  total: number
  available: number
  reserved: number
  soldOrRented: number
}

interface PropertiesSubHeaderProps {
  stats: PropertyStats
  search?: string
  onSearchChange?: (value: string) => void
  onTypeChange?: (value: PropertyType | 'all') => void
  onListingTypeChange?: (value: ListingType | 'all') => void
  onStatusChange?: (value: PropertyStatus | 'all') => void
}

const propertyTypeLabels: Record<PropertyType, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  COMMERCIAL: 'Commercial',
  LAND: 'Land',
  OFFICE: 'Office',
  WAREHOUSE: 'Warehouse',
  GARAGE: 'Garage',
}

const propertyStatusLabels: Record<PropertyStatus, string> = {
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  SOLD: 'Sold',
  RENTED: 'Rented',
  OFF_MARKET: 'Off market',
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
    { label: 'Sold / rented', value: stats.soldOrRented },
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
              {(Object.keys(propertyTypeLabels) as PropertyType[]).map(
                (type) => (
                  <SelectItem key={type} value={type}>
                    {propertyTypeLabels[type]}
                  </SelectItem>
                ),
              )}
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
              <SelectItem value="SALE">Sale</SelectItem>
              <SelectItem value="RENT">Rent</SelectItem>
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
              {(Object.keys(propertyStatusLabels) as PropertyStatus[]).map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    {propertyStatusLabels[status]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}

export default PropertiesSubHeader
