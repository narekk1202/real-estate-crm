import { contactStatusValues, contactTypeValues } from '@crm/shared';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { user } from './index.js';

export const contactType = pgEnum('contact_type', contactTypeValues);
export const contactStatus = pgEnum('contact_status', contactStatusValues);

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
	type: contactType('type').default('LEAD').notNull(),
	status: contactStatus('status').default('ACTIVE').notNull(),
	source: text('source'),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const insertContactsSchema = createInsertSchema(contacts, {
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number'),
	email: z.email(),
}).omit({ userId: true });

export const selectContactsSchema = createSelectSchema(contacts, {
	email: z.email(),
});

export type NewContact = z.infer<typeof insertContactsSchema>;
export type Contacts = z.infer<typeof selectContactsSchema>;
