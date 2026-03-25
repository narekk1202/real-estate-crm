import ResetPasswordContainer from '#/components/auth/reset-password-container'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const resetPasswordSearchSchema = z.object({
  token: z
    .string()
    .optional()
    .transform((v) => v ?? ''),
})

export const Route = createFileRoute('/_auth/reset-password')({
  validateSearch: resetPasswordSearchSchema,
  beforeLoad: ({ search }) => {
    if (!search.token) {
      throw redirect({ to: '/forgot-password' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <ResetPasswordContainer token={token} />
    </main>
  )
}
