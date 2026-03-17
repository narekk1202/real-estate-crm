import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors'

const app = new Hono();

app.use(
	'/api/*',
	cors({
		origin: 'http://localhost:3001',
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
	}),
);

const routes = app.get('/', c => {
	return c.json({ message: 'Hello World!' });
});

export type AppType = typeof routes;

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	info => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
