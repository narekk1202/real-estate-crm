import type { PropertyStats } from '#/components/properties/properties-sub-header'
import type {
  ListingType,
  Property,
  PropertyStatus,
  PropertyType,
} from '#/components/properties/property-card'
import { useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Baghramyan 14, apt. 3',
    address: 'Baghramyan 14, apt. 3',
    city: 'Yerevan',
    country: 'Armenia',
    type: 'APARTMENT',
    listingType: 'SALE',
    status: 'AVAILABLE',
    price: '145000',
    bedrooms: 3,
    bathrooms: 2,
    areaM2: 87,
    agent: { id: 'a1', name: 'Anna K.' },
  },
  {
    id: '2',
    title: 'Komitas 27, floor 5',
    address: 'Komitas 27, floor 5',
    city: 'Yerevan',
    country: 'Armenia',
    type: 'APARTMENT',
    listingType: 'RENT',
    status: 'RESERVED',
    price: '650',
    bedrooms: 2,
    bathrooms: 1,
    areaM2: 62,
    agent: { id: 'a2', name: 'Boris M.' },
  },
  {
    id: '3',
    title: 'Mashtots Ave 5',
    address: 'Mashtots Ave 5',
    city: 'Yerevan',
    country: 'Armenia',
    type: 'APARTMENT',
    listingType: 'SALE',
    status: 'AVAILABLE',
    price: '290000',
    bedrooms: 4,
    bathrooms: 3,
    areaM2: 154,
    agent: { id: 'a3', name: 'Clara T.' },
  },
  {
    id: '4',
    title: 'Abovyan 8, house',
    address: 'Abovyan 8, house',
    city: 'Yerevan',
    country: 'Armenia',
    type: 'HOUSE',
    listingType: 'SALE',
    status: 'SOLD',
    price: '520000',
    bedrooms: 5,
    bathrooms: 3,
    areaM2: 230,
    agent: { id: 'a1', name: 'Anna K.' },
  },
  {
    id: '5',
    title: 'Tigranyan 3, office',
    address: 'Tigranyan 3, office',
    city: 'Yerevan',
    country: 'Armenia',
    type: 'OFFICE',
    listingType: 'RENT',
    status: 'AVAILABLE',
    price: '1200',
    areaM2: 95,
    agent: { id: 'a4', name: 'David S.' },
  },
  {
    id: '6',
    title: 'Northern Ave 12',
    address: 'Northern Ave 12',
    city: 'Yerevan',
    country: 'Armenia',
    type: 'COMMERCIAL',
    listingType: 'SALE',
    status: 'RESERVED',
    price: '890000',
    areaM2: 410,
    agent: { id: 'a2', name: 'Boris M.' },
  },
]

function computeStats(properties: Property[]): PropertyStats {
  return {
    total: properties.length,
    available: properties.filter((p) => p.status === 'AVAILABLE').length,
    reserved: properties.filter((p) => p.status === 'RESERVED').length,
    soldOrRented: properties.filter(
      (p) => p.status === 'SOLD' || p.status === 'RENTED',
    ).length,
  }
}

export function usePropertiesPage() {
  const [searchText, setSearchText] = useState('')
  const [type, setType] = useState<PropertyType | 'all'>('all')
  const [listingType, setListingType] = useState<ListingType | 'all'>('all')
  const [status, setStatus] = useState<PropertyStatus | 'all'>('all')
  const [search] = useDebounce(searchText, 300)

  const stats = useMemo(() => computeStats(MOCK_PROPERTIES), [])

  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => {
      const matchesSearch =
        !search ||
        p.address.toLowerCase().includes(search.toLowerCase()) ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase())

      const matchesType = type === 'all' || p.type === type
      const matchesListing =
        listingType === 'all' || p.listingType === listingType
      const matchesStatus = status === 'all' || p.status === status

      return matchesSearch && matchesType && matchesListing && matchesStatus
    })
  }, [search, type, listingType, status])

  const onSearchChange = (value: string) => setSearchText(value)
  const onTypeChange = (value: PropertyType | 'all') => setType(value)
  const onListingTypeChange = (value: ListingType | 'all') =>
    setListingType(value)
  const onStatusChange = (value: PropertyStatus | 'all') => setStatus(value)

  return {
    searchText,
    stats,
    properties: filteredProperties,
    isLoading: false,
    onSearchChange,
    onTypeChange,
    onListingTypeChange,
    onStatusChange,
  }
}
