import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './index.js';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const propertyType = pgEnum('property_type', [
	'APARTMENT',
	'HOUSE',
	'COMMERCIAL',
	'LAND',
	'OFFICE',
	'WAREHOUSE',
	'GARAGE',
]);

export const listingType = pgEnum('listing_type', ['SALE', 'RENT']);

export const propertyStatus = pgEnum('property_status', [
	'AVAILABLE',
	'RESERVED',
	'SOLD',
	'RENTED',
	'OFF_MARKET',
]);

export const properties = pgTable('properties', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	address: text('address').notNull(),
	city: text('city').notNull(),
	country: text('country').notNull(),
	type: propertyType('type').default('APARTMENT').notNull(),
	listingType: listingType('listing_type').default('SALE').notNull(),
	status: propertyStatus('status').default('AVAILABLE').notNull(),
	price: text('price').notNull(),
	bedrooms: integer('bedrooms'),
	bathrooms: integer('bathrooms'),
	areaM2: integer('area_m2'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export type Properties = typeof properties.$inferSelect;
export type NewProperties = typeof properties.$inferInsert;

export const insertPropertiesSchema = createInsertSchema(properties);
export const selectPropertiesSchema = createSelectSchema(properties);