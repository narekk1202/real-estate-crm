import { Hono } from 'hono';
import { authMiddleware } from 'src/middlewares/auth.js';

const app = new Hono().use(authMiddleware)

const routes = app.get('/', async c => {});

export default routes;
export type PropertiesRoutesType = typeof routes;