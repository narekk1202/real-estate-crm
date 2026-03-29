import {
  listingTypeValues,
  propertyStatusValues,
  propertyTypeValues,
  type NewProperty,
} from '@crm/shared'
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
import ImageUploader from './image-uploader'

interface PropertyFormProps {
  form: UseFormReturn<NewProperty>
  actionButton: React.ReactNode
  onSubmit: (data: NewProperty) => void | Promise<void>
}

function PropertyForm({
  form,
  onSubmit,
  actionButton,
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

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="bedrooms">
            Bedrooms{' '}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Input
            {...form.register('bedrooms', { valueAsNumber: true })}
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
            {...form.register('bathrooms', { valueAsNumber: true })}
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
            {...form.register('areaM2', { valueAsNumber: true })}
            id="areaM2"
            type="number"
            min={1}
            placeholder="85"
          />
        </div>
      </div>

			<ImageUploader />

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
