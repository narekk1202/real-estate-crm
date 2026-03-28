import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import {
	contactStatus,
	contactType,
	insertContactsSchema,
} from '../../db/schemas/contacts.js';
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
				type: z.enum(contactType.enumValues).optional(),
				status: z.enum(contactStatus.enumValues).optional(),
			}),
		),
		async c => {
			try {
				const user = c.var.user;
				const { search, type, status } = c.req.valid('query');
				const contacts = await contactsService.getAll(user.id, {
					search,
					type,
					status,
				});
				return c.json(contacts);
			} catch (error) {
				console.error('Error fetching contacts:', error);
				return c.json({ error: 'Failed to fetch contacts' }, 500);
			}
		},
	)
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
	});

export default routes;
export type ContactsRoutes = typeof routes;
