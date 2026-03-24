import { AppShell } from '#/components/layout/app-shell'
import { getSession } from '#/lib/auth-client'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session.error) {
      console.error('Error fetching session:', session.error)
      return
    }

    console.log(session.data);
    if (!session.data) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppShell,
})
