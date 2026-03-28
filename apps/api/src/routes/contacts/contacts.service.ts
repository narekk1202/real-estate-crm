import type { GetAllFilters } from '@crm/shared';
import { and, count, eq, ilike, or, SQL, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { contacts, type NewContacts } from '../../db/schemas/contacts.js';

class ContactsService {
	async getAll(userId: string, filters: GetAllFilters) {
		const { search, status, type } = filters;

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

		const baseConditions = [
			eq(contacts.userId, userId),
			search &&
				or(
					ilike(contacts.firstName, `%${search}%`),
					ilike(contacts.lastName, `%${search}%`),
					ilike(contacts.email, `%${search}%`),
					ilike(contacts.phone, `%${search}%`),
				),
		].filter(Boolean) as SQL[];

		const [data, stats] = await Promise.all([
			db
				.select()
				.from(contacts)
				.where(and(...conditions)),
			db
				.select({
					total: count(),
					active: count(
						sql`CASE WHEN ${contacts.status} = 'ACTIVE' THEN 1 END`,
					),
					leads: count(sql`CASE WHEN ${contacts.type} = 'LEAD' THEN 1 END`),
					clients: count(sql`CASE WHEN ${contacts.type} = 'CLIENT' THEN 1 END`),
				})
				.from(contacts)
				.where(and(...baseConditions)),
		]);

		return {
			data,
			stats: stats[0],
		};
	}

	async create(userId: string, data: NewContacts) {
		return await db
			.insert(contacts)
			.values({ ...data, userId })
			.returning();
	}
}

export const contactsService = new ContactsService();
