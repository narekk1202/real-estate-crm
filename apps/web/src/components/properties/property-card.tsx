import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { listingConfig, statusConfig } from '#/constants/property-card'
import { cn } from '#/lib/utils'
import { formatPrice, getInitials } from '#/utils/property-card'
import type { Property } from '@crm/shared'
import { Bath, Bed, Home, Maximize2 } from 'lucide-react'
import EditProperty from './edit-property'

interface PropertyCardProps {
  property: Property
  onView?: (property: Property) => void
}

function PropertyCard({ property, onView }: Readonly<PropertyCardProps>) {
  const status = statusConfig[property.status]
  const listing = listingConfig[property.listingType]

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative bg-muted h-44 flex items-center justify-center border-b">
        {property.images[0] ? (
          <img
            src={property.images[0].url}
            alt="Property"
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
            <EditProperty property={property} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyCard
