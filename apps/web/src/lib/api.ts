import { env } from '#/env'
import type { AppType } from '@crm/api'
import { hc } from 'hono/client'

export const api = hc<AppType>(env.VITE_API_URL)
