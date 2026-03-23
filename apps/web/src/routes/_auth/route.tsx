import { getSession } from '#/lib/auth-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad: async () => {
    try {
      const session = await getSession()
      console.log(session);
      if (session) throw redirect({ to: '/' })
    } catch (error) {
      console.log(error)
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
