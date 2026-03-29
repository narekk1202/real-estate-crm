import { reset, seed } from 'drizzle-seed';
import { db } from './index.js';
import * as schema from './schemas/index.js';

const titles = [
	'Modern Downtown Apartment',
	'Spacious Family Villa',
	'Cozy Studio Near Park',
	'Luxury Penthouse with View',
	'Renovated Townhouse',
	'Quiet Suburban Cottage',
	'Prime Commercial Space',
	'Industrial Warehouse Unit',
	'Beachfront Bungalow',
	'Mountain Retreat Cabin',
	'City Center Office',
	'Secure Underground Garage',
];

const cities = ['Yerevan', 'Gyumri', 'Vanadzor', 'Abovyan', 'Hrazdan'];

async function main() {
	await reset(db, schema);

	await seed(db, schema).refine(f => ({
		contacts: {
			count: 20,
			columns: {
				firstName: f.firstName(),
				lastName: f.lastName(),
				email: f.email(),
				phone: f.phoneNumber({ template: '+374 ## ######' }),
			},
		},
		properties: {
			count: 50,
			columns: {
				title: f.valuesFromArray({ values: titles }),
				description: f.loremIpsum({ sentencesCount: 3 }),
				address: f.streetAddress(),
				city: f.valuesFromArray({ values: cities }),
				country: f.default({ defaultValue: 'Armenia' }),
				type: f.valuesFromArray({
					values: [
						'APARTMENT',
						'HOUSE',
						'COMMERCIAL',
						'LAND',
						'OFFICE',
						'WAREHOUSE',
						'GARAGE',
					],
				}),
				listingType: f.valuesFromArray({ values: ['SALE', 'RENT'] }),
				status: f.valuesFromArray({
					values: ['AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'OFF_MARKET'],
				}),
				price: f.valuesFromArray({
					values: [
						'45000',
						'75000',
						'120000',
						'185000',
						'250000',
						'380000',
						'520000',
						'750000',
						'1100000',
						'1850000',
					],
				}),
				bedrooms: f.int({ minValue: 1, maxValue: 6 }),
				bathrooms: f.int({ minValue: 1, maxValue: 4 }),
				areaM2: f.int({ minValue: 30, maxValue: 450 }),
			},
		},
	}));
}

main();
