import {
  listingTypeValues,
  propertyStatusValues,
  propertyTypeValues,
  type NewProperty,
  type NewPropertyInput,
  type PropertyImage,
} from '@crm/shared'
import { X } from 'lucide-react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import FieldError from '../errors/field-error'
import { Button } from '../ui/button'
import { DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import ContactSelect from './contact-select'
import ImageUploader from './image-uploader'

interface PropertyFormProps {
  form: UseFormReturn<NewPropertyInput, unknown, NewProperty>
  actionButton: React.ReactNode
  onSubmit: (data: NewProperty) => void | Promise<void>
  files: File[]
  onFilesChange: (files: File[]) => void
  existingImages?: PropertyImage[]
  onDeleteImage?: (id: string) => void
}

const toOptionalNumber = (value: unknown) =>
  value === '' ? undefined : Number(value)

function PropertyForm({
  form,
  onSubmit,
  actionButton,
  files,
  onFilesChange,
  existingImages,
  onDeleteImage,
}: Readonly<PropertyFormProps>) {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 py-2 -mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          {...form.register('title')}
          id="title"
          placeholder="Modern downtown apartment"
        />
        <FieldError field="title" form={form} />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">
          Description{' '}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Textarea
          {...form.register('description')}
          id="description"
          placeholder="Spacious 2-bedroom unit with city views..."
          rows={3}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="address">Address</Label>
        <Input
          {...form.register('address')}
          id="address"
          placeholder="123 Main St"
        />
        <FieldError field="address" form={form} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input {...form.register('city')} id="city" placeholder="New York" />
          <FieldError field="city" form={form} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="country">Country</Label>
          <Input
            {...form.register('country')}
            id="country"
            placeholder="United States"
          />
          <FieldError field="country" form={form} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypeValues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v.charAt(0) + v.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError field="type" form={form} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="listingType">Listing</Label>
          <Controller
            control={form.control}
            name="listingType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="listingType" className="w-full">
                  <SelectValue placeholder="Select listing" />
                </SelectTrigger>
                <SelectContent>
                  {listingTypeValues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v.charAt(0) + v.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError field="listingType" form={form} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {propertyStatusValues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v === 'OFF_MARKET'
                        ? 'Off market'
                        : v.charAt(0) + v.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError field="status" form={form} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="price">Price</Label>
        <Input {...form.register('price')} id="price" placeholder="450000" />
        <FieldError field="price" form={form} />
      </div>

      <div className="grid gap-1.5">
        <Label>
          Owner{' '}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Controller
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <ContactSelect value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="bedrooms">
            Bedrooms{' '}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Input
            {...form.register('bedrooms', { setValueAs: toOptionalNumber })}
            id="bedrooms"
            type="number"
            min={1}
            placeholder="2"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="bathrooms">
            Bathrooms{' '}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Input
            {...form.register('bathrooms', { setValueAs: toOptionalNumber })}
            id="bathrooms"
            type="number"
            min={1}
            placeholder="1"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="areaM2">
            Area (m²){' '}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Input
            {...form.register('areaM2', { setValueAs: toOptionalNumber })}
            id="areaM2"
            type="number"
            min={1}
            placeholder="85"
          />
        </div>
      </div>

      <ImageUploader files={files} onFilesChange={onFilesChange} existingCount={existingImages?.length ?? 0} />

      {existingImages && existingImages.length > 0 && (
        <div className="grid gap-1.5">
          <Label>Current Images</Label>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img) => (
              <div key={img.id} className="group relative size-20">
                <img
                  src={img.url}
                  alt="Property"
                  className="size-20 rounded-md border object-cover"
                />
                <button
                  type="button"
                  onClick={() => onDeleteImage?.(img.id)}
                  className="absolute -right-1.5 -top-1.5 hidden size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Cancel
          </Button>
        </DialogTrigger>
        {actionButton}
      </div>
    </form>
  )
}

export default PropertyForm
