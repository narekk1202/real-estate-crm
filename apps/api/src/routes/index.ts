import { Hono } from 'hono';
import contactsRoutes from './contacts/contacts.routes.js';

const routes = new Hono().route('/contacts', contactsRoutes);

export default routes;
export type ApiRoutes = typeof routes;
