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
import { useRegisterPage } from '#/hooks/use-register-page'
import { Link } from '@tanstack/react-router'

const RegisterContainer = () => {
  const { isPending, form, onSubmit } = useRegisterPage()

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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create a new account
          </CardDescription>
          <CardAction>
            <Link to="/login">
              <Button variant="link">Log In</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  {...form.register('name')}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                />
                {returnErrorMessage('name')}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...form.register('email')}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                />
                {returnErrorMessage('email')}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...form.register('password')}
                  id="password"
                  type="password"
                  placeholder="********"
                />
                {returnErrorMessage('password')}
              </div>
            </div>
            <Button type="submit" className="w-full mt-5" loading={isPending}>
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default RegisterContainer
