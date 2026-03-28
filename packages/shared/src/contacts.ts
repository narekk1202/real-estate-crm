export type ContactType = 'LEAD' | 'CLIENT' | 'AGENT' | 'LANDLORD';
export type ContactStatus = 'ACTIVE' | 'INACTIVE' | 'POTENTIAL' | 'ARCHIVED';

export interface GetAllFilters {
	search?: string;
	type?: ContactType;
	status?: ContactStatus;
}
