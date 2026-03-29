import { useNewPropertyMutation } from '#/services/mutations/properties'
import { insertPropertySchema, type NewProperty } from '@crm/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useNewProperty = () => {
  const [open, setOpen] = useState(false)
  const newProperty = useNewPropertyMutation()

  const form = useForm<NewProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      country: '',
      type: 'APARTMENT',
      listingType: 'SALE',
      status: 'AVAILABLE',
      price: '',
      bedrooms: undefined,
      bathrooms: undefined,
      areaM2: undefined,
      ownerId: undefined,
    },
  })

  const onSubmit = (data: NewProperty) => {
    newProperty.mutate(data, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      },
    })
  }

  return {
    form,
    open,
    isPending: false,
    setOpen,
    onSubmit,
  }
}
