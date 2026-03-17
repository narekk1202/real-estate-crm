import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
	'/api/*',
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3001',
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
	}),
);

const routes = app.get('/', c => c.text('Hello, World!'));

export type AppType = typeof routes;

export default app;
