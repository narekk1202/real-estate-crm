import { reset, seed } from 'drizzle-seed';
import { db } from './index.js';
import * as schema from './schemas/index.js';

async function main() {
	await reset(db, schema);
	await seed(db, schema);
}

await main()
	.catch(console.error)
	.finally(() => process.exit(0));
