import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './env.js';
import { auth } from './lib/auth.js';
import routes from './routes/index.js';

const app = new Hono();

app.use(logger());
app.use(
	'/api/*',
	cors({
		origin: env.FRONTEND_URL || 'http://localhost:3001',
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	}),
);

app.onError((err, c) => {
	console.error(err);
	return c.json({ error: 'Internal Server Error' }, 500);
});

app.all('/api/auth/*', c => auth.handler(c.req.raw));
app.route('/api', routes);

export type AppType = typeof app;
export default app;
