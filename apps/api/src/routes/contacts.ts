import { Hono } from 'hono';
import type { auth } from '../lib/auth.js'

type Variables = {
  user: typeof auth.$Infer.Session.user;
};

const contactsRoute = new Hono<{ Variables: Variables }>();

contactsRoute.get('/', c => {
	const user = c.var.user;
	return c.json({ message: `Hello, ${user.name}!` });
});

export default contactsRoute