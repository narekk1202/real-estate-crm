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
import { useResetPasswordPage } from '#/hooks/use-reset-password-page'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

type ResetPasswordContainerProps = {
  token: string
}

const ResetPasswordContainer = ({ token }: ResetPasswordContainerProps) => {
  const { form, onSubmit, isPending } = useResetPasswordPage(token)

  return (
    <section className="w-full h-auto flex flex-col items-center gap-4">
      <img src="/logo.png" alt="Real Estate CRM Logo" className="w-32 h-auto" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" loading={isPending}>
              Reset password
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

export default ResetPasswordContainer
