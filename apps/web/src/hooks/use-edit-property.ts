import { client } from '#/services/api'
import { useImageUpload } from '#/services/mutations/images'
import { useEditPropertyMutation } from '#/services/mutations/properties'
import {
  insertPropertySchema,
  type NewProperty,
  type NewPropertyInput,
  type Property,
} from '@crm/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const useEditProperty = (property: Property) => {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const editProperty = useEditPropertyMutation({ propertyId: property.id })
  const imageUpload = useImageUpload()

  const form = useForm<NewPropertyInput, unknown, NewProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      title: property.title,
      description: property.description ?? '',
      address: property.address,
      city: property.city,
      country: property.country,
      type: property.type,
      listingType: property.listingType,
      status: property.status,
      price: property.price,
      bedrooms: property.bedrooms ?? undefined,
      bathrooms: property.bathrooms ?? undefined,
      areaM2: property.areaM2 ?? undefined,
      ownerId: property.ownerId ?? undefined,
    },
  })

  const handleOpenChange = (value: boolean) => {
    if (value) {
      form.reset({
        title: property.title,
        description: property.description ?? '',
        address: property.address,
        city: property.city,
        country: property.country,
        type: property.type,
        listingType: property.listingType,
        status: property.status,
        price: property.price,
        bedrooms: property.bedrooms ?? undefined,
        bathrooms: property.bathrooms ?? undefined,
        areaM2: property.areaM2 ?? undefined,
        ownerId: property.ownerId ?? undefined,
      })
      setFiles([])
    }
    setOpen(value)
  }

  const onSubmit = async (data: NewProperty) => {
    setIsSubmitting(true)
    try {
      await editProperty.mutateAsync(data)

      if (files.length > 0) {
        const urls = await imageUpload.mutateAsync({
          files,
          folder: 'properties',
        })
        const imagesResult = await client.api.properties[':id'].images.$post({
          param: { id: property.id },
          json: { urls },
        })
        if (!imagesResult.ok) {
          toast.error('Property updated but new images failed to save', {
            description: 'You can add images from the property page',
          })
        }
      }

      setOpen(false)
      setFiles([])
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    files,
    setFiles,
    open,
    isPending: isSubmitting,
    setOpen: handleOpenChange,
    onSubmit,
  }
}
