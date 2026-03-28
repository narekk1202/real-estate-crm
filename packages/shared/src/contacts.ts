export const contactTypeValues = ['LEAD', 'CLIENT', 'AGENT', 'LANDLORD'] as const;
export const contactStatusValues = ['ACTIVE', 'INACTIVE', 'POTENTIAL', 'ARCHIVED'] as const;

export type ContactType = (typeof contactTypeValues)[number];
export type ContactStatus = (typeof contactStatusValues)[number];

export interface GetAllFilters {
	search?: string;
	type?: ContactType;
	status?: ContactStatus;
}
