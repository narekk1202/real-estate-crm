import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		PORT: z.string().default('3000'),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		FRONTEND_URL: z.url(),
		RESEND_API_KEY: z.string().startsWith('re_'),
	},
	runtimeEnv: process.env,
});
