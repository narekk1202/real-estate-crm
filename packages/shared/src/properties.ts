import z from 'zod';

export const propertyTypeValues = [
	'APARTMENT',
	'HOUSE',
	'COMMERCIAL',
	'LAND',
	'OFFICE',
	'WAREHOUSE',
	'GARAGE',
] as const;
export const propertyStatusValues = [
	'AVAILABLE',
	'RESERVED',
	'SOLD',
	'RENTED',
	'OFF_MARKET',
] as const;

export const listingTypeValues = ['SALE', 'RENT'] as const;

export type PropertyType = (typeof propertyTypeValues)[number];
export type PropertyStatus = (typeof propertyStatusValues)[number];
export type ListingType = (typeof listingTypeValues)[number];

export interface GetAllPropertiesFilters {
	search?: string;
	type?: PropertyType;
	status?: PropertyStatus;
	listingType?: ListingType;
	page?: number;
	pageSize?: number;
}

export interface PropertyStats {
	total: number;
	available: number;
	reserved: number;
	sold: number;
	rented: number;
}

export const insertPropertySchema = z.object({
	title: z.string().min(1),
	description: z.string().nullable().optional(),
	address: z.string().min(1),
	city: z.string().min(1),
	country: z.string().min(1),
	type: z.enum(propertyTypeValues),
	listingType: z.enum(listingTypeValues),
	status: z.enum(propertyStatusValues),
	price: z.string().min(1),
	bedrooms: z.number().int().positive().nullable().optional(),
	bathrooms: z.number().int().positive().nullable().optional(),
	areaM2: z.number().int().positive().nullable().optional(),
});

export type NewProperty = z.infer<typeof insertPropertySchema>;

export type Property = NewProperty & {
	id: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
};
