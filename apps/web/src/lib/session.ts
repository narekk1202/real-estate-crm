import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getSession } from './auth-client'

export const getUserSession = createServerFn().handler(async () => {
  const request = getRequest()
  const session = await getSession({
    fetchOptions: {
      headers: request.headers,
    },
  })
  return session
})
