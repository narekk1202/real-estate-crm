import type { GetAllFilters } from '@crm/shared';
import { and, eq, ilike, or, SQL } from 'drizzle-orm';
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

		return await db
			.select()
			.from(contacts)
			.where(and(...conditions));
	}

	async create(userId: string, data: NewContacts) {
		return await db
			.insert(contacts)
			.values({ ...data, userId })
			.returning();
	}
}

export const contactsService = new ContactsService();
