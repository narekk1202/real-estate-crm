import { and, eq, ilike } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { contacts } from '../../db/schemas/contacts.js';

class ContactsService {
	async getAll(userId: string, search?: string) {
		try {
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
		} catch (error) {
			console.error('Error fetching contacts:', error);
		}
	}
}

export const contactsService = new ContactsService();
