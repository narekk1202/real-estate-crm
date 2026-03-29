import type { ListingType } from '@crm/shared'

export function getInitials(name: string) {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

export function formatPrice(price: string, listingType: ListingType) {
	const numericPrice = Number.parseFloat(price)
	const formatted = Number.isNaN(numericPrice)
		? price
		: new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				maximumFractionDigits: 0,
			}).format(numericPrice)

	return listingType === 'RENT' ? `${formatted} / mo` : formatted
}