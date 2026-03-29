import type { GetAllPropertiesFilters } from '@crm/shared';
import { and, count, eq, ilike, or, SQL } from 'drizzle-orm';
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
}

export const propertiesService = new PropertiesService();
