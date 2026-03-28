import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.js';
import { contacts, properties } from './index.js';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const dealStage = pgEnum('deal_stage', [
	'PROSPECT',
	'NEGOTIATION',
	'CONTRACT',
	'CLOSED_WON',
	'CLOSED_LOST',
]);

export const deals = pgTable('deals', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	contactId: text('contact_id')
		.notNull()
		.references(() => contacts.id, { onDelete: 'cascade' }),
	propertyId: text('property_id').references(() => properties.id, {
		onDelete: 'set null',
	}),
	title: text('title').notNull(),
	stage: dealStage('stage').notNull().default('PROSPECT'),
	value: integer('value').notNull(),
	expectedCloseDate: timestamp('expected_close_date').notNull(),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export type Deals = typeof deals.$inferSelect;
export type NewDeals = typeof deals.$inferInsert;

export const insertDealsSchema = createInsertSchema(deals);
export const selectDealsSchema = createSelectSchema(deals);