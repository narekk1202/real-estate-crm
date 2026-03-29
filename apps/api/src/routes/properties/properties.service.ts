import type { GetAllPropertiesFilters } from '@crm/shared';
import {
	and,
	count,
	eq,
	getTableColumns,
	ilike,
	or,
	sql,
	SQL,
} from 'drizzle-orm';
import { db } from '../../db/index.js';
import { contacts } from '../../db/schemas/contacts.js';
import { properties } from '../../db/schemas/properties.js';
import { propertyImages } from '../../db/schemas/property_images.js';

class PropertiesService {
	async getAll(userId: string, filters: GetAllPropertiesFilters) {
		const {
			search,
			status,
			type,
			listingType,
			page = 1,
			pageSize = 10,
		} = filters;
		const offset = (page - 1) * pageSize;

		const conditions: SQL[] = [eq(properties.userId, userId)];

		if (search) {
			conditions.push(
				or(
					ilike(properties.title, `%${search}%`),
					ilike(properties.description, `%${search}%`),
					ilike(properties.address, `%${search}%`),
					ilike(properties.city, `%${search}%`),
					ilike(properties.country, `%${search}%`),
				)!,
			);
		}
		if (type) conditions.push(eq(properties.type, type));
		if (status) conditions.push(eq(properties.status, status));
		if (listingType) conditions.push(eq(properties.listingType, listingType));

		const imageAgg = db
			.select({
				propertyId: propertyImages.propertyId,
				images: sql<{ id: string; url: string; order: number }[]>`
					coalesce(
						json_agg(
							json_build_object('id', ${propertyImages.id}, 'url', ${propertyImages.url}, 'order', ${propertyImages.order})
							ORDER BY ${propertyImages.order}
						),
						'[]'::json
					)
				`.as('images'),
			})
			.from(propertyImages)
			.groupBy(propertyImages.propertyId)
			.as('image_agg');

		const [data, [{ total }]] = await Promise.all([
			db
				.select({
					...getTableColumns(properties),
					agent: {
						id: contacts.id,
						name: sql<string>`${contacts.firstName} || ' ' || ${contacts.lastName}`,
					},
					images: imageAgg.images,
				})
				.from(properties)
				.leftJoin(contacts, eq(properties.ownerId, contacts.id))
				.leftJoin(imageAgg, eq(properties.id, imageAgg.propertyId))
				.where(and(...conditions))
				.limit(pageSize)
				.offset(offset),
			db
				.select({ total: count() })
				.from(properties)
				.where(and(...conditions)),
		]);

		const normalized = data.map(({ agent, images, ...property }) => ({
			...property,
			agent: property.ownerId ? agent : null,
			images: images ?? [],
		}));

		return { data: normalized, total };
	}

	async getStats(userId: string) {
		const [stats] = await db
			.select({
				total: count(),
				available: count(
					sql`CASE WHEN ${properties.status} = 'AVAILABLE' THEN 1 END`,
				),
				reserved: count(
					sql`CASE WHEN ${properties.status} = 'RESERVED' THEN 1 END`,
				),
				sold: count(sql`CASE WHEN ${properties.status} = 'SOLD' THEN 1 END`),
				rented: count(
					sql`CASE WHEN ${properties.status} = 'RENTED' THEN 1 END`,
				),
			})
			.from(properties)
			.where(and(eq(properties.userId, userId)));

		return stats;
	}
}

export const propertiesService = new PropertiesService();
