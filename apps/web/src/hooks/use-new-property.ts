import { QUERY_KEYS } from '#/constants/request-keys'
import { client } from '#/services/api'
import { useImageUpload } from '#/services/mutations/images'
import { useNewPropertyMutation } from '#/services/mutations/properties'
import {
  insertPropertySchema,
  type NewProperty,
  type NewPropertyInput,
} from '@crm/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const useNewProperty = () => {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const newProperty = useNewPropertyMutation()
  const imageUpload = useImageUpload()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<NewPropertyInput, unknown, NewProperty>({
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
      price: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      areaM2: undefined,
      ownerId: undefined,
    },
  })

  const resetState = () => {
    setOpen(false)
    setFiles([])
    form.reset()
  }

  const invalidateCache = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROPERTIES_STATS],
      }),
    ])
  }

  const onSubmit = async (data: NewProperty) => {
    setIsSubmitting(true)
    try {
      const result = await newProperty.mutateAsync(data)

      if (files.length > 0 && result?.id) {
        const urls = await imageUpload.mutateAsync({
          files,
          folder: 'properties',
        })
        const imagesResult = await client.api.properties[':id'].images.$post({
          param: { id: result.id },
          json: { urls },
        })
        if (!imagesResult.ok) {
          toast.error('Property created but images failed to save', {
            description: 'You can add images later from the property page',
            action: {
              label: 'View property',
              onClick: () =>
                navigate({
                  to: '/dashboard/properties/$propertyId',
                  params: { propertyId: result.id },
                }),
            },
          })
          resetState()
          await invalidateCache()
          return
        }
      }

      toast.success('Property created successfully')
      resetState()
      await invalidateCache()
    } catch (error) {
      if (newProperty.isSuccess) {
        toast.error('Property created but something went wrong with images')
      } else {
        toast.error('Failed to create property')
      }
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
    setOpen,
    onSubmit,
  }
}
