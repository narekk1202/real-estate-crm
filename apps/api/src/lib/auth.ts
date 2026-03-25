import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import * as schema from '../db/schemas/index.js';
import { env } from '../env.js';
import { resetPasswordTemplate } from './email-templates/reset-password.js';
import { sendEmail } from './send-email.js';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema,
	}),
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.FRONTEND_URL || 'http://localhost:3001'],
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
			try {
				const result = await db
					.update(schema.user)
					.set({ emailVerified: true })
					.where(eq(schema.user.id, user.id));

				if (result) {
					console.log('User email verified:', user.id);
				}
			} catch (error) {
				console.error('Error verifying user email:', {
					userId: user.id,
					error,
				});
			}
		},
	},
	baseURL: env.BETTER_AUTH_URL,
});
