import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/contacts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/contacts"!</div>
}
