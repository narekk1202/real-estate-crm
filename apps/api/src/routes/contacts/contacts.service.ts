import { and, eq, ilike } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { contacts, type NewContacts } from '../../db/schemas/contacts.js';

class ContactsService {
	async getAll(userId: string, search?: string) {
		return await db
			.select()
			.from(contacts)
			.where(
				search
					? and(
							eq(contacts.userId, userId),
							ilike(contacts.firstName, `%${search}%`),
						)
					: eq(contacts.userId, userId),
			);
	}

	async create(userId: string, data: NewContacts) {
		return await db
			.insert(contacts)
			.values({ ...data, userId })
			.returning();
	}
}

export const contactsService = new ContactsService();
