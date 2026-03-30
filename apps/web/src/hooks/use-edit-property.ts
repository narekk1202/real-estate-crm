import { QUERY_KEYS } from '#/constants/request-keys'
import { client } from '#/services/api'
import { useImageUpload } from '#/services/mutations/images'
import {
  useDeletePropertyImageMutation,
  useEditPropertyMutation,
} from '#/services/mutations/properties'
import {
  insertPropertySchema,
  type NewProperty,
  type NewPropertyInput,
  type Property,
  type PropertyImage,
} from '@crm/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const useEditProperty = (property: Property) => {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const queryClient = useQueryClient()
  const editProperty = useEditPropertyMutation({ propertyId: property.id })
  const deleteImage = useDeletePropertyImageMutation()
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
      setDeletedImageIds([])
    }
    setOpen(value)
  }

  const onDeleteImage = (imageId: string) => {
    setDeletedImageIds((prev) => [...prev, imageId])
  }

  const existingImages: PropertyImage[] = property.images.filter(
    (img) => !deletedImageIds.includes(img.id),
  )

  const onSubmit = async (data: NewProperty) => {
    setIsSubmitting(true)
    try {
      await editProperty.mutateAsync(data)

      if (deletedImageIds.length > 0) {
        await Promise.all(
          deletedImageIds.map((imageId) =>
            deleteImage.mutateAsync({ propertyId: property.id, imageId }),
          ),
        )
      }

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

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROPERTY, property.id],
        }),
      ])

      setOpen(false)
      setFiles([])
      setDeletedImageIds([])
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
    existingImages,
    onDeleteImage,
    open,
    isPending: isSubmitting,
    setOpen: handleOpenChange,
    onSubmit,
  }
}
