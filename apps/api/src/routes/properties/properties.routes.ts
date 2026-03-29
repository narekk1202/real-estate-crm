import { propertyStatusValues, propertyTypeValues } from '@crm/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { authMiddleware } from 'src/middlewares/auth.js';
import z from 'zod';
import { propertiesService } from './properties.service.js';

const app = new Hono().use(authMiddleware);

const routes = app.get(
	'/',
	zValidator(
		'query',
		z.object({
			page: z.coerce.number().optional(),
			pageSize: z.coerce.number().optional(),
			search: z.string().optional(),
			status: z.enum(propertyStatusValues).optional(),
			type: z.enum(propertyTypeValues).optional(),
		}),
	),
	async c => {
		try {
			const user = c.var.user;
			const { page, pageSize, search, status, type } = c.req.valid('query');
			const properties = await propertiesService.getAll(user.id, {
				page,
				pageSize,
				search,
				status,
				type,
			});
			return c.json(properties);
		} catch (error) {
			console.error('Error fetching properties:', error);
			return c.json({ error: 'Failed to fetch properties' }, 500);
		}
	},
);

export default routes;
export type PropertiesRoutesType = typeof routes;
