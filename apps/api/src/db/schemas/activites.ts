import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './index.js';

export const entityType = pgEnum('entity_type', ['PROPERTY', 'CONTACT', 'DEAL']);
export const type = pgEnum('activity_type', [
	'CALL',
	'EMAIL',
	'MEETING',
	'NOTE',
	'TASK',
]);

export const activites = pgTable('activites', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	entityType: entityType('entity_type').notNull(),
	type: type('type').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	dueDate: timestamp('due_date'),
	completedAt: timestamp('completed_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
});
