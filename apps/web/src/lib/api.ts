import { env } from '#/env'
import type { AppType } from '@crm/api/src/app'
import { hc } from 'hono/client'

export const client = hc<AppType>(env.VITE_API_URL)