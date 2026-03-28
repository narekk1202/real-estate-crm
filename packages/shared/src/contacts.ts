import z from 'zod'

export const contactTypeValues = ['LEAD', 'CLIENT', 'AGENT', 'LANDLORD'] as const;
export const contactStatusValues = ['ACTIVE', 'INACTIVE', 'POTENTIAL', 'ARCHIVED'] as const;

export type ContactType = (typeof contactTypeValues)[number];
export type ContactStatus = (typeof contactStatusValues)[number];

export interface GetAllFilters {
  search?: string
  type?: ContactType
  status?: ContactStatus
  page?: number
  pageSize?: number
}

export interface ContactStats {
	total: number;
	active: number;
	leads: number;
	clients: number;
}

export const insertContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email(),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number'),
  type: z.enum(contactTypeValues),
  status: z.enum(contactStatusValues),
  source: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type NewContact = z.infer<typeof insertContactSchema>

export type Contact = NewContact & {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}