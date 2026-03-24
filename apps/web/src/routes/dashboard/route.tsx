import { AppShell } from '#/components/layout/app-shell'
import { getUserSession } from '#/lib/session'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await getUserSession()
    if (session.error) {
      console.error('Error fetching session:', session.error)
      return
    }

    if (!session.data) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppShell,
})
