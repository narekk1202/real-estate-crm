import { Hono } from 'hono';
import { auth } from '../lib/auth.js';
import { authMiddleware } from '../middlewares/auth.js';
import contactsRoute from './contacts.js';

export const registerRoutes = (app: Hono) => {
	app.all('/api/auth/*', c => auth.handler(c.req.raw));

	const api = new Hono();
	api.use(authMiddleware);
	api.route('/contacts', contactsRoute);

	app.route('/api', api);
};
