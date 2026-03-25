import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { properties } from './index.js';

export const propertyImages = pgTable('property_images', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	propertyId: text('property_id')
		.notNull()
		.references(() => properties.id, { onDelete: 'cascade' }),
	url: text().notNull(),
	order: integer().default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type PropertyImages = typeof propertyImages.$inferSelect;
export type NewPropertyImages = typeof propertyImages.$inferInsert;

export const insertPropertyImagesSchema = createInsertSchema(propertyImages);
export const selectPropertyImagesSchema = createSelectSchema(propertyImages);
