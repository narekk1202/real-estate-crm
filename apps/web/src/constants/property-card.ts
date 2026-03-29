import type { ListingType, PropertyStatus } from '@crm/shared'

export const statusConfig: Record<
	PropertyStatus,
	{ label: string; className: string }
> = {
	AVAILABLE: {
		label: 'Available',
		className:
			'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
	},
	RESERVED: {
		label: 'Reserved',
		className:
			'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
	},
	SOLD: {
		label: 'Sold',
		className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
	},
	RENTED: {
		label: 'Rented',
		className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
	},
	OFF_MARKET: {
		label: 'Off market',
		className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
	},
}

export const listingConfig: Record<ListingType, { label: string; className: string }> =
	{
		SALE: {
			label: 'Sale',
			className:
				'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
		},
		RENT: {
			label: 'Rent',
			className:
				'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
		},
	}