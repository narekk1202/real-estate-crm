import AuthContainer from '#/components/auth/auth-container'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <AuthContainer type="register" />
    </main>
  )
}
