import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Link } from '@tanstack/react-router'

type AuthContainerProps = {
  type: 'login' | 'register'
}

const AuthContainer = ({ type }: AuthContainerProps) => {
  const isLogin = type === 'login'
  const title = isLogin ? 'Login to your account' : 'Create an account'
  const description = isLogin
    ? 'Enter your email below to login to your account'
    : 'Enter your email below to create a new account'
  const actionText = isLogin ? 'Login' : 'Register'
  const actionLinkText = isLogin ? 'Sign Up' : 'Login'
  const actionLinkHref = isLogin ? '/register' : '/login'

  return (
    <section className="w-full h-auto flex flex-col items-center gap-4">
      <img src="/logo.png" alt="Real Estate CRM Logo" className="w-32 h-auto" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <Link to={actionLinkHref}>
              <Button variant="link">{actionLinkText}</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {!isLogin && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <Link
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      to={'/forgot-password'}
                    >
                      <Button variant="link">Forgot your password?</Button>
                    </Link>
                  )}
                </div>
                <Input id="password" type="password" placeholder='********' required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            {actionText}
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}

export default AuthContainer
