import { Hono } from 'hono';
import contactsRoutes from './contacts/contacts.routes.js';
import propertiesRoutes from './properties/properties.routes.js';

const routes = new Hono()
	.route('/contacts', contactsRoutes)
	.route('/properties', propertiesRoutes);

export default routes;
export type ApiRoutes = typeof routes;
