import { defineConfig } from 'drizzle-kit';
import { env } from './src/env.js'

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schemas/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
