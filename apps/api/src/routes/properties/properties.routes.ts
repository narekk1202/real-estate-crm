import {
	insertPropertySchema,
	listingTypeValues,
	propertyStatusValues,
	propertyTypeValues,
} from '@crm/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { authMiddleware } from '../../middlewares/auth.js';
import { propertiesService } from './properties.service.js';

const app = new Hono().use(authMiddleware);

const routes = app
	.get(
		'/',
		zValidator(
			'query',
			z.object({
				page: z.coerce.number().optional(),
				pageSize: z.coerce.number().optional(),
				search: z.string().optional(),
				status: z.enum(propertyStatusValues).optional(),
				type: z.enum(propertyTypeValues).optional(),
				listingType: z.enum(listingTypeValues).optional(),
			}),
		),
		async c => {
			try {
				const user = c.var.user;
				const { page, pageSize, search, status, type, listingType } =
					c.req.valid('query');
				const properties = await propertiesService.getAll(user.id, {
					page,
					pageSize,
					search,
					status,
					type,
					listingType,
				});
				return c.json(properties);
			} catch (error) {
				console.error('Error fetching properties:', error);
				return c.json({ error: 'Failed to fetch properties' }, 500);
			}
		},
	)
	.get('/stats', async c => {
		try {
			const user = c.var.user;
			const stats = await propertiesService.getStats(user.id);
			return c.json(stats);
		} catch (error) {
			console.error('Error fetching property stats:', error);
			return c.json({ error: 'Failed to fetch property stats' }, 500);
		}
	})
	.post('/', zValidator('json', insertPropertySchema), async c => {
		try {
			const user = c.var.user;
			const data = c.req.valid('json');
			const newProperty = await propertiesService.create(user.id, data);
			return c.json(newProperty, 201);
		} catch (error) {
			console.error('Error creating property:', error);
			return c.json({ error: 'Failed to create property' }, 500);
		}
	});

export default routes;
export type PropertiesRoutes = typeof routes;
