import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { user } from './index.js';

export const entityType = pgEnum('entity_type', [
	'PROPERTY',
	'CONTACT',
	'DEAL',
]);
export const type = pgEnum('activity_type', [
	'CALL',
	'EMAIL',
	'MEETING',
	'NOTE',
	'TASK',
]);

export const activities = pgTable('activities', {
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

export type Activities = typeof activities.$inferSelect;
export type NewActivities = typeof activities.$inferInsert;

export const insertActivitiesSchema = createInsertSchema(activities);
export const selectActivitiesSchema = createSelectSchema(activities);
