import type { GetAllFilters } from '@crm/shared';
import { and, count, eq, ilike, or, SQL, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { contacts, type NewContact } from '../../db/schemas/contacts.js';

class ContactsService {
	async getAll(userId: string, filters: GetAllFilters) {
		const { search, status, type, page = 1, pageSize = 10 } = filters;
		const offset = (page - 1) * pageSize;

		const conditions = [
			eq(contacts.userId, userId),
			search &&
				or(
					ilike(contacts.firstName, `%${search}%`),
					ilike(contacts.lastName, `%${search}%`),
					ilike(contacts.email, `%${search}%`),
					ilike(contacts.phone, `%${search}%`),
				),
			type && eq(contacts.type, type),
			status && eq(contacts.status, status),
		].filter(Boolean) as SQL[];

		const [data, [{ total }]] = await Promise.all([
			db
				.select()
				.from(contacts)
				.where(and(...conditions))
				.limit(pageSize)
				.offset(offset),
			db
				.select({ total: count() })
				.from(contacts)
				.where(and(...conditions)),
		]);

		return { data, total };
	}

	async getStats(userId: string) {
		const [stats] = await db
			.select({
				total: count(),
				active: count(sql`CASE WHEN ${contacts.status} = 'ACTIVE' THEN 1 END`),
				leads: count(sql`CASE WHEN ${contacts.type} = 'LEAD' THEN 1 END`),
				clients: count(sql`CASE WHEN ${contacts.type} = 'CLIENT' THEN 1 END`),
			})
			.from(contacts)
			.where(and(eq(contacts.userId, userId)));

		return stats;
	}

	async create(userId: string, data: NewContact) {
		return await db
			.insert(contacts)
			.values({ ...data, userId })
			.returning();
	}
}

export const contactsService = new ContactsService();
