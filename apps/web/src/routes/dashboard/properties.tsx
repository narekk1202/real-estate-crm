import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/properties')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/properties"!</div>
}
