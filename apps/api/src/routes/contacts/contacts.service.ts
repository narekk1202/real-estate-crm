import type { GetAllContactsFilters, NewContact } from '@crm/shared';
import { and, count, eq, ilike, or, SQL, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { contacts } from '../../db/schemas/contacts.js';

class ContactsService {
	async getAll(userId: string, filters: GetAllContactsFilters) {
		const { search, status, type, page = 1, pageSize = 10 } = filters;
		const offset = (page - 1) * pageSize;

		const conditions: SQL[] = [eq(contacts.userId, userId)];

		if (search) {
			conditions.push(
				or(
					ilike(contacts.firstName, `%${search}%`),
					ilike(contacts.lastName, `%${search}%`),
					ilike(contacts.email, `%${search}%`),
					ilike(contacts.phone, `%${search}%`),
				)!,
			);
		}
		if (type) conditions.push(eq(contacts.type, type));
		if (status) conditions.push(eq(contacts.status, status));

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
		const [newContact] = await db
			.insert(contacts)
			.values({ ...data, userId })
			.returning();
		return newContact;
	}

	async update(userId: string, contactId: string, data: Partial<NewContact>) {
		const [updatedContact] = await db
			.update(contacts)
			.set(data)
			.where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
			.returning();

		if (!updatedContact) return null;
		return updatedContact;
	}

	async getById(userId: string, contactId: string) {
		const [contact] = await db
			.select()
			.from(contacts)
			.where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));

		return contact ?? null;
	}

	async delete(userId: string, contactId: string) {
		const [deletedContact] = await db
			.delete(contacts)
			.where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
			.returning();

		return deletedContact;
	}
}

export const contactsService = new ContactsService();
