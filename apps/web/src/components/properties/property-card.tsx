import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { cn } from '#/lib/utils'
import { Bath, Bed, Home, Maximize2 } from 'lucide-react'

export type PropertyStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'SOLD'
  | 'RENTED'
  | 'OFF_MARKET'
export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'COMMERCIAL'
  | 'LAND'
  | 'OFFICE'
  | 'WAREHOUSE'
  | 'GARAGE'
export type ListingType = 'SALE' | 'RENT'

export interface Property {
  id: string
  title: string
  address: string
  city: string
  country: string
  type: PropertyType
  listingType: ListingType
  status: PropertyStatus
  price: string
  bedrooms?: number | null
  bathrooms?: number | null
  areaM2?: number | null
  imageUrl?: string | null
  agent?: {
    id: string
    name: string
    avatarUrl?: string | null
  } | null
}

const statusConfig: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: 'Available',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  RESERVED: {
    label: 'Reserved',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  SOLD: {
    label: 'Sold',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
  RENTED: {
    label: 'Rented',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
  OFF_MARKET: {
    label: 'Off market',
    className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
}

const listingConfig: Record<ListingType, { label: string; className: string }> =
  {
    SALE: {
      label: 'Sale',
      className:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    RENT: {
      label: 'Rent',
      className:
        'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    },
  }

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatPrice(price: string, listingType: ListingType) {
  const numericPrice = Number.parseFloat(price)
  const formatted = Number.isNaN(numericPrice)
    ? price
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(numericPrice)

  return listingType === 'RENT' ? `${formatted} / mo` : formatted
}

interface PropertyCardProps {
  property: Property
  onView?: (property: Property) => void
  onEdit?: (property: Property) => void
}

function PropertyCard({
  property,
  onView,
  onEdit,
}: Readonly<PropertyCardProps>) {
  const status = statusConfig[property.status]
  const listing = listingConfig[property.listingType]

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative bg-muted h-44 flex items-center justify-center border-b">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground select-none">
            <Home className="size-10 opacity-30" />
            <span className="text-xs">No photo</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <Badge className={cn('border-0 font-medium', status.className)}>
            {status.label}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className={cn('border-0 font-medium', listing.className)}>
            {listing.label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col gap-3">
        <div>
          <p className="font-semibold leading-snug">{property.address}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {property.city}, {property.country}
          </p>
        </div>

        <p className="text-lg font-bold tracking-tight">
          {formatPrice(property.price, property.listingType)}
        </p>

        {(property.bedrooms != null ||
          property.bathrooms != null ||
          property.areaM2 != null) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="size-3.5" />
                {property.bedrooms} bed
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="size-3.5" />
                {property.bathrooms} bath
              </span>
            )}
            {property.areaM2 != null && (
              <span className="flex items-center gap-1">
                <Maximize2 className="size-3.5" />
                {property.areaM2} m²
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1 border-t">
          {property.agent ? (
            <div className="flex items-center gap-2 min-w-0">
              <Avatar size="sm">
                {property.agent.avatarUrl && (
                  <AvatarImage
                    src={property.agent.avatarUrl}
                    alt={property.agent.name}
                  />
                )}
                <AvatarFallback className="text-xs">
                  {getInitials(property.agent.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                {property.agent.name.split(' ')[0]}{' '}
                {property.agent.name.split(' ')[1]?.[0]}.
              </span>
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(property)}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => onEdit?.(property)}
            >
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyCard
