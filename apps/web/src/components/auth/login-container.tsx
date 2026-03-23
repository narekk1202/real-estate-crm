import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useLoginPage } from '#/hooks/use-login-page'
import { Link } from '@tanstack/react-router'

const LoginContainer = () => {
  const { form, onSubmit, isPending } = useLoginPage()

  const returnErrorMessage = (field: keyof typeof form.formState.errors) => {
    return (
      <div className="text-sm text-red-500 mt-1">
        {form.formState.errors[field]?.message}
      </div>
    )
  }

  return (
    <section className="w-full h-auto flex flex-col items-center gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Link to="/register">
              <Button variant="link">Sign Up</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register('email')}
                />
                {returnErrorMessage('email')}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    to="/forgot-password"
                  >
                    <Button type='button' variant="link">Forgot your password?</Button>
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  {...form.register('password')}
                />
                {returnErrorMessage('password')}
              </div>
            </div>
            <Button type="submit" className="w-full mt-5" loading={isPending}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default LoginContainer
