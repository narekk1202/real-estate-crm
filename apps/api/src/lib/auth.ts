import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { resetPasswordTemplate } from './email-templates/reset-password.js';
import { sendEmail } from './send-email.js';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema,
	}),
	secret: process.env.BETTER_AUTH_SECRET,
	trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3001'],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url, token }) => {
			sendEmail({
				to: user.email,
				subject: 'Reset your password',
				html: resetPasswordTemplate(url),
			});
			console.log('Reset password email sent:', { user, url, token });
		},
		onPasswordReset: async ({ user }) => {
			db.update(schema.user)
				.set({ emailVerified: true })
				.where(eq(schema.user.id, user.id));
		},
	},
	baseURL: process.env.BETTER_AUTH_URL,
});
