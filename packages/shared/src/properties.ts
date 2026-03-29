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
	title: z.string().min(1, 'Title is required'),
	description: z.string().nullable().optional(),
	address: z.string().min(1, 'Address is required'),
	city: z.string().min(1, 'City is required'),
	country: z.string().min(1, 'Country is required'),
	type: z.enum(propertyTypeValues),
	listingType: z.enum(listingTypeValues),
	status: z.enum(propertyStatusValues),
	price: z.coerce.number('Price must be number').min(1, 'Price is required'),
	bedrooms: z.number().positive('Bedrooms must be positive').nullable().optional(),
	bathrooms: z.number().int().positive('Bathrooms must be positive').nullable().optional(),
	areaM2: z.number().int().positive('Area must be positive').nullable().optional(),
	ownerId: z.uuid().nullable().optional(),
});

export type NewPropertyInput = z.input<typeof insertPropertySchema>;
export type NewProperty = z.infer<typeof insertPropertySchema>;

export interface PropertyImage {
	id: string;
	url: string;
	order: number;
}

export interface PropertyAgent {
	id: string;
	name: string;
}

export type Property = NewProperty & {
	id: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	agent: PropertyAgent | null;
	images: PropertyImage[];
};
