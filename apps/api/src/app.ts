import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './lib/auth.js';

const app = new Hono();

app.use(
	'/api/*',
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3001',
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	}),
);

app.all('/api/auth/*', c => auth.handler(c.req.raw));

const routes = app.get('/', c => c.text('Hello, World!'));

export type AppType = typeof routes;

export default app;
