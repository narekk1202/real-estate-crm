import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { AlertTriangle, RefreshCw } from 'lucide-react'

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  function handleReset() {
    reset?.()
    router.invalidate()
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. You can try again or return home.
          </CardDescription>
        </CardHeader>

        {error?.message && (
          <CardContent>
            <div className="rounded-md bg-muted px-4 py-3">
              <p className="font-mono text-xs text-muted-foreground break-all">
                {error.message}
              </p>
            </div>
          </CardContent>
        )}

        <CardFooter className="flex gap-2">
          <Button className="flex-1" onClick={handleReset}>
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ErrorComponent
