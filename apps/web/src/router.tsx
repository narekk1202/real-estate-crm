import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { getContext } from './integrations/tanstack-query/root-provider'
import { routeTree } from './routeTree.gen'
import ErrorComponent from '@/components/error-component'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: getContext(),
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorComponent,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
