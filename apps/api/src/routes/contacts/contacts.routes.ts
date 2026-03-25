import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { authMiddleware } from '../../middlewares/auth.js';
import { contactsService } from './contacts.service.js';

const app = new Hono().use(authMiddleware);

const routes = app.get(
	'/',
	zValidator('query', z.object({ search: z.string().optional() })),
	async c => {
		const user = c.var.user;
		const { search } = c.req.valid('query');
		const contacts = await contactsService.getAll(user.id, search);
		return c.json(contacts);
	},
);

export default routes;
export type ContactsRoutes = typeof routes;
