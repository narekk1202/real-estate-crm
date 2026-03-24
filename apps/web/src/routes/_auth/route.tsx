import { getUserSession } from '#/lib/session'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getUserSession()
    if (session.error) {
      console.error('Error fetching session:', session.error)
      return
    }

    if (session.data) {
      throw redirect({ to: '/dashboard' })
    }
  },
})

function RouteComponent() {
  return (
    <main className="page-wrap">
      <Outlet />
    </main>
  )
}
