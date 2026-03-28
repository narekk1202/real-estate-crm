import { reset, seed } from 'drizzle-seed';
import { db } from './index.js';
import * as schema from './schemas/index.js';

async function main() {
	await reset(db, schema);
	await seed(db, schema, { count: 50 });
}

await main()
	.catch(console.error)
	.finally(() => process.exit(0));
