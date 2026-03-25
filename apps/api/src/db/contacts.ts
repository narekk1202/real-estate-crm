import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.js';

export const contact_type = pgEnum('contact_type', [
	'LEAD',
	'CLIENT',
	'AGENT',
	'LANDLORD',
]);

export const contact_status = pgEnum('contact_status', [
	'ACTIVE',
	'INACTIVE',
	'POTENTIAL',
	'ARCHIVED',
]);

export const contacts = pgTable('contacts', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	type: contact_type('type').default('LEAD').notNull(),
	status: contact_status('status').default('ACTIVE').notNull(),
	source: text('source'),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});
