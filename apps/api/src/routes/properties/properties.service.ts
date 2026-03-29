import type { GetAllPropertiesFilters } from '@crm/shared';
import { and, count, eq, ilike, or, sql, SQL } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { properties } from '../../db/schemas/properties.js';

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

		const conditions = [
			eq(properties.userId, userId),
			search &&
				or(
					ilike(properties.title, `%${search}%`),
					ilike(properties.description, `%${search}%`),
					ilike(properties.address, `%${search}%`),
					ilike(properties.city, `%${search}%`),
					ilike(properties.country, `%${search}%`),
				),
			type && eq(properties.type, type),
			status && eq(properties.status, status),
			listingType && eq(properties.listingType, listingType),
		].filter(Boolean) as SQL[];

		const [data, [{ total }]] = await Promise.all([
			db
				.select()
				.from(properties)
				.where(and(...conditions))
				.limit(pageSize)
				.offset(offset),
			db
				.select({ total: count() })
				.from(properties)
				.where(and(...conditions)),
		]);

		return { data, total };
	}

	async getStats(userId: string) {
			const [stats] = await db
				.select({
					total: count(),
					available: count(sql`CASE WHEN ${properties.status} = 'AVAILABLE' THEN 1 END`),
					reserved: count(sql`CASE WHEN ${properties.status} = 'RESERVED' THEN 1 END`),
					sold: count(sql`CASE WHEN ${properties.status} = 'SOLD' THEN 1 END`),
					rented: count(sql`CASE WHEN ${properties.status} = 'RENTED' THEN 1 END`),
				})
				.from(properties)
				.where(and(eq(properties.userId, userId)));
	
			return stats;
		}
}

export const propertiesService = new PropertiesService();
