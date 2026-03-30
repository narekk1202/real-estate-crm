import type { GetAllPropertiesFilters, NewProperty } from '@crm/shared';
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
import { env } from '../../env.js';
import { storageService } from '../storage/storage.service.js';

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
				.offset(offset)
				.orderBy(sql`${properties.createdAt} DESC`),
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

	async create(userId: string, data: NewProperty) {
		return await db
			.insert(properties)
			.values({ ...data, userId })
			.returning();
	}

	async update(userId: string, propertyId: string, data: NewProperty) {
		const [updatedProperty] = await db
			.update(properties)
			.set(data)
			.where(and(eq(properties.id, propertyId), eq(properties.userId, userId)))
			.returning();

		return updatedProperty;
	}

	async addImages(propertyId: string, userId: string, urls: string[]) {
		const [property] = await db
			.select({ id: properties.id })
			.from(properties)
			.where(and(eq(properties.id, propertyId), eq(properties.userId, userId)));

		if (!property) throw new Error('Property not found or access denied');

		await db
			.insert(propertyImages)
			.values(urls.map((url, order) => ({ propertyId, url, order })));
	}

	async deleteImage(imageId: string, userId: string) {
		const [image] = await db
			.select({ id: propertyImages.id, url: propertyImages.url })
			.from(propertyImages)
			.innerJoin(properties, eq(propertyImages.propertyId, properties.id))
			.where(
				and(eq(propertyImages.id, imageId), eq(properties.userId, userId)),
			);

		if (!image) throw new Error('Image not found or access denied');

		await db.delete(propertyImages).where(eq(propertyImages.id, imageId));

		const key = image.url.replace(`${env.R2_PUBLIC_URL}/`, '');
		await storageService.deleteFile(key);
	}

	async delete(userId: string, propertyId: string) {
		const images = await db
			.select({ url: propertyImages.url })
			.from(propertyImages)
			.innerJoin(properties, eq(propertyImages.propertyId, properties.id))
			.where(and(eq(properties.id, propertyId), eq(properties.userId, userId)));

		const [deleted] = await db
			.delete(properties)
			.where(and(eq(properties.id, propertyId), eq(properties.userId, userId)))
			.returning();

		if (!deleted) throw new Error('Property not found or access denied');

		if (images.length > 0) {
			await Promise.all(
				images.map(({ url }) =>
					storageService.deleteFile(url.replace(`${env.R2_PUBLIC_URL}/`, '')),
				),
			);
		}

		return deleted;
	}
}

export const propertiesService = new PropertiesService();
