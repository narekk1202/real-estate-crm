import ForgotPasswordContainer from '#/components/auth/forgot-password-container'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <ForgotPasswordContainer />
    </main>
  )
}
