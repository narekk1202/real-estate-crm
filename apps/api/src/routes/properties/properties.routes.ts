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
	.get('/:id', async c => {
		try {
			const user = c.var.user;
			const { id } = c.req.param();
			const property = await propertiesService.getById(user.id, id);
			if (!property) return c.json({ error: 'Property not found' }, 404);
			return c.json(property);
		} catch (error) {
			console.error('Error fetching property:', error);
			return c.json({ error: 'Failed to fetch property' }, 500);
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
	})
	.put('/:id', zValidator('json', insertPropertySchema), async c => {
		try {
			const user = c.var.user;
			const data = c.req.valid('json');
			const { id } = c.req.param();
			const updatedProperty = await propertiesService.update(user.id, id, data);
			return c.json(updatedProperty);
		} catch (error) {
			console.error('Error updating property:', error);
			return c.json({ error: 'Failed to update property' }, 500);
		}
	})
	.post(
		'/:id/images',
		zValidator('json', z.object({ urls: z.array(z.string()) })),
		async c => {
			try {
				const user = c.var.user;
				const { id } = c.req.param();
				const { urls } = c.req.valid('json');
				await propertiesService.addImages(id, user.id, urls);
				return c.json({ success: true }, 201);
			} catch (error) {
				console.error('Error adding property images:', error);
				return c.json({ error: 'Failed to add property images' }, 500);
			}
		},
	)
	.delete('/:id/images/:imageId', async c => {
		try {
			const user = c.var.user;
			const { imageId } = c.req.param();
			await propertiesService.deleteImage(imageId, user.id);
			return c.json({ success: true });
		} catch (error) {
			console.error('Error deleting property image:', error);
			return c.json({ error: 'Failed to delete property image' }, 500);
		}
	})
	.delete('/:id', async c => {
		try {
			const user = c.var.user;
			const { id } = c.req.param();
			const deleted = await propertiesService.delete(user.id, id);
			return c.json(deleted);
		} catch (error) {
			console.error('Error deleting property:', error);
			return c.json({ error: 'Failed to delete property' }, 500);
		}
	});

export default routes;
export type PropertiesRoutes = typeof routes;
