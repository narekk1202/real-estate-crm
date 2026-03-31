import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { authMiddleware } from '../../middlewares/auth.js';
import { storageService } from './storage.service.js';

const app = new Hono().use(authMiddleware);

const routes = app.post(
	'/presign',
	zValidator(
		'json',
		z.object({
			filename: z.string(),
			contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
			folder: z.string().optional().default('misc'),
		}),
	),
	async c => {
		try {
			const { filename, contentType, folder } = c.req.valid('json');
			const ext = filename.split('.').pop();
			const key = `${folder}/${crypto.randomUUID()}.${ext}`;

			const result = await storageService.getUploadUrl(key, contentType);
			return c.json({ ...result, publicUrl: storageService.getPublicUrl(key) });
		} catch (error) {
			console.error('Error generating presigned URL:', error);
			return c.json({ error: 'Failed to generate presigned URL' }, 500);
		}
	},
);

export default routes;
export type StorageRoutes = typeof routes;
