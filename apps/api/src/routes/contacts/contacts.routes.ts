import { contactStatusValues, contactTypeValues } from '@crm/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { insertContactsSchema } from '../../db/schemas/contacts.js';
import { authMiddleware } from '../../middlewares/auth.js';
import { contactsService } from './contacts.service.js';

const app = new Hono().use(authMiddleware);

const routes = app
	.get(
		'/',
		zValidator(
			'query',
			z.object({
				search: z.string().optional(),
				type: z.enum(contactTypeValues).optional(),
				status: z.enum(contactStatusValues).optional(),
				page: z.coerce.number().optional(),
				pageSize: z.coerce.number().optional(),
			}),
		),
		async c => {
			try {
				const user = c.var.user;
				const { search, type, status, page, pageSize } = c.req.valid('query');
				const contacts = await contactsService.getAll(user.id, {
					search,
					type,
					status,
					page,
					pageSize,
				});
				return c.json(contacts);
			} catch (error) {
				console.error('Error fetching contacts:', error);
				return c.json({ error: 'Failed to fetch contacts' }, 500);
			}
		},
	)
	.get('/stats', async c => {
		try {
			const user = c.var.user;
			const stats = await contactsService.getStats(user.id);
			return c.json(stats);
		} catch (error) {
			console.error('Error fetching contact stats:', error);
			return c.json({ error: 'Failed to fetch contact stats' }, 500);
		}
	})
	.post('/', zValidator('json', insertContactsSchema), async c => {
		try {
			const user = c.var.user;
			const data = c.req.valid('json');
			const newContact = await contactsService.create(user.id, data);
			return c.json(newContact);
		} catch (error) {
			console.error('Error creating contact:', error);
			return c.json({ error: 'Failed to create contact' }, 500);
		}
	})
	.put('/:id', zValidator('json', insertContactsSchema), async c => {
		try {
			const user = c.var.user;
			const data = c.req.valid('json');
			const { id } = c.req.param();
			const updatedContact = await contactsService.update(user.id, id, data);
			return c.json(updatedContact);
		} catch (error) {
			console.error('Error updating contact:', error);
			return c.json({ error: 'Failed to update contact' }, 500);
		}
	});

export default routes;
export type ContactsRoutes = typeof routes;
