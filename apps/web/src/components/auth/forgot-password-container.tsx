import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useForgotPasswordPage } from '#/hooks/use-forgot-password-page'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

const ForgotPasswordContainer = () => {
  const { form, onSubmit, isPending } = useForgotPasswordPage()

  return (
    <section className="w-full h-auto flex flex-col items-center gap-4">
      <img src="/logo.png" alt="Real Estate CRM Logo" className="w-32 h-auto" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" loading={isPending}>
              Send reset link
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Link to="/login" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  )
}

export default ForgotPasswordContainer
