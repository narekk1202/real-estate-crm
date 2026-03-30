import DeleteProperty from '#/components/properties/delete-property'
import EditProperty from '#/components/properties/edit-property'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { listingConfig, statusConfig } from '#/constants/property-card'
import { cn } from '#/lib/utils'
import { propertyByIdQueryOptions } from '#/services/query-options/properties'
import { formatPrice, getInitials } from '#/utils/property-card'
import type { Property, PropertyStatus, PropertyType } from '@crm/shared'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Tag,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/properties/$propertyId')({
  component: RouteComponent,
})

const typeLabels: Record<PropertyType, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  COMMERCIAL: 'Commercial',
  LAND: 'Land',
  OFFICE: 'Office',
  WAREHOUSE: 'Warehouse',
  GARAGE: 'Garage',
}

const statusBadgeClass: Record<PropertyStatus, string> = {
  AVAILABLE: 'bg-green-100 text-green-700',
  RESERVED: 'bg-amber-100 text-amber-700',
  SOLD: 'bg-gray-100 text-gray-600',
  RENTED: 'bg-gray-100 text-gray-600',
  OFF_MARKET: 'bg-red-100 text-red-600',
}

function PropertyGallery({ property }: Readonly<{ property: Property }>) {
  const images = property.images
  const [current, setCurrent] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border bg-muted">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Home className="size-12 opacity-30" />
          <span className="text-sm">No photos available</span>
        </div>
      </div>
    )
  }

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)
  const next = () => setCurrent((c) => (c + 1) % images.length)

  return (
    <div className="group relative overflow-hidden rounded-xl border">
      <div className="relative h-72 w-full">
        {images.map((img, i) => (
          <img
            key={img.id}
            src={img.url}
            alt={`${property.title} view ${i + 1}`}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
              i === current ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/60"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/60"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrent(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  'size-1.5 rounded-full transition-all',
                  i === current
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/80',
                )}
              />
            ))}
          </div>

          <div className="absolute right-3 bottom-3 rounded-md bg-black/40 px-2 py-0.5 text-xs text-white">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}

function PropertyHeader({
  property,
  onDelete,
}: Readonly<{ property: Property; onDelete: () => void }>) {
  const status = statusConfig[property.status]
  const listing = listingConfig[property.listingType]

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {property.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {property.address}, {property.city}, {property.country}
            </p>
            <div className="flex items-center gap-2">
              <Badge className={cn('border-0 font-medium', status.className)}>
                {status.label}
              </Badge>
              <Badge className={cn('border-0 font-medium', listing.className)}>
                {listing.label}
              </Badge>
              <Badge variant="outline">{typeLabels[property.type]}</Badge>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <EditProperty property={property} />
            <DeleteProperty property={property} onSuccess={onDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PropertyDetailsCard({ property }: Readonly<{ property: Property }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <InfoRow label="Price">
            <span className="text-lg font-bold">
              {formatPrice(property.price, property.listingType)}
            </span>
          </InfoRow>
          <Separator />
          <InfoRow label="Type">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5 text-muted-foreground" />
              {typeLabels[property.type]}
            </span>
          </InfoRow>
          <Separator />
          <InfoRow label="Status">
            <Badge
              className={cn(
                'border-0 font-medium',
                statusBadgeClass[property.status],
              )}
            >
              {statusConfig[property.status].label}
            </Badge>
          </InfoRow>
          <Separator />
          <InfoRow label="Listing">
            {listingConfig[property.listingType].label}
          </InfoRow>
          {(property.bedrooms != null ||
            property.bathrooms != null ||
            property.areaM2 != null) && (
            <>
              <Separator />
              <div className="grid grid-cols-3 gap-4 pt-1">
                {property.bedrooms != null && (
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <Bed className="size-4 text-muted-foreground" />
                    <span className="text-base font-semibold">
                      {property.bedrooms}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Bedrooms
                    </span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <Bath className="size-4 text-muted-foreground" />
                    <span className="text-base font-semibold">
                      {property.bathrooms}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Bathrooms
                    </span>
                  </div>
                )}
                {property.areaM2 != null && (
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <Maximize2 className="size-4 text-muted-foreground" />
                    <span className="text-base font-semibold">
                      {property.areaM2}
                    </span>
                    <span className="text-xs text-muted-foreground">m²</span>
                  </div>
                )}
              </div>
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}

function PropertyDescriptionCard({
  property,
}: Readonly<{ property: Property }>) {
  if (!property.description) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
          {property.description}
        </p>
      </CardContent>
    </Card>
  )
}

function PropertySidebarCard({ property }: Readonly<{ property: Property }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          {property.agent && (
            <>
              <div className="space-y-2">
                <dt className="text-muted-foreground text-sm">Owner</dt>
                <dd className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback className="text-xs">
                      {getInitials(property.agent.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {property.agent.name}
                  </span>
                </dd>
              </div>
              <Separator />
            </>
          )}
          <InfoRow label="Listed">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              {new Date(property.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </InfoRow>
          <Separator />
          <InfoRow label="Last Updated">
            <span className="flex items-center gap-1.5">
              <Tag className="size-3.5 text-muted-foreground" />
              {new Date(property.updatedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </InfoRow>
        </dl>
      </CardContent>
    </Card>
  )
}

function InfoRow({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <main className="page-wrap space-y-6">
      <div className="h-5 w-36 animate-pulse rounded bg-muted" />
      <div className="h-72 animate-pulse rounded-xl bg-muted" />
      <div className="h-28 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
      </div>
    </main>
  )
}

function RouteComponent() {
  const { propertyId } = Route.useParams()
  const navigate = useNavigate()

  const { data: property, isLoading } = useQuery(
    propertyByIdQueryOptions(propertyId),
  )

  if (isLoading) return <LoadingSkeleton />

  if (!property || 'error' in property) {
    return (
      <main className="page-wrap space-y-4">
        <Link
          to="/dashboard/properties"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to Properties
        </Link>
        <p className="text-muted-foreground">Property not found.</p>
      </main>
    )
  }

  return (
    <main className="page-wrap space-y-6">
      <Link
        to="/dashboard/properties"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Properties
      </Link>

      <PropertyGallery property={property} />

      <PropertyHeader
        property={property}
        onDelete={() => navigate({ to: '/dashboard/properties' })}
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <PropertyDetailsCard property={property} />
          <PropertyDescriptionCard property={property} />
        </div>
        <PropertySidebarCard property={property} />
      </div>
    </main>
  )
}
