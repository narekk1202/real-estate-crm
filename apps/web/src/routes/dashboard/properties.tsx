import PropertiesGrid from '#/components/properties/properties-grid'
import PropertiesSubHeader from '#/components/properties/properties-sub-header'
import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { usePropertiesPage } from '#/hooks/use-properties-page'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/dashboard/properties')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    stats,
    properties,
    isLoading,
    searchText,
    onSearchChange,
    onTypeChange,
    onListingTypeChange,
    onStatusChange,
  } = usePropertiesPage()

  return (
    <main className="page-wrap space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse, manage, and track all your real estate listings.
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-1 size-4" />
          Add property
        </Button>
      </div>

      <Separator />

      <PropertiesSubHeader
        stats={stats}
        search={searchText}
        onSearchChange={onSearchChange}
        onTypeChange={onTypeChange}
        onListingTypeChange={onListingTypeChange}
        onStatusChange={onStatusChange}
      />

      <PropertiesGrid properties={properties} isLoading={isLoading} />
    </main>
  )
}
