import type { NewContact } from '@crm/api/src/db/schemas'
import { contactStatusValues, contactTypeValues } from '@crm/shared'
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

interface ContactFormProps {
  isPending: boolean
  form: UseFormReturn<NewContact>
  onSubmit: (data: NewContact) => void | Promise<void>
}

function ContactForm({ form, onSubmit, isPending }: Readonly<ContactFormProps>) {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 py-2 -mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            {...form.register('firstName')}
            id="firstName"
            name="firstName"
            placeholder="John"
          />
          <FieldError field="firstName" form={form} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            {...form.register('lastName')}
            id="lastName"
            name="lastName"
            placeholder="Doe"
          />
          <FieldError field="lastName" form={form} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          {...form.register('email')}
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
        />
        <FieldError field="email" form={form} />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input
          {...form.register('phone')}
          id="phone"
          name="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
        />
        <FieldError field="phone" form={form} />
      </div>

      <div className="flex gap-2">
        <div className="grid gap-1.5 w-full">
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
                  {contactTypeValues.map((v) => (
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

        <div className="grid gap-1.5 w-full">
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
                  {contactStatusValues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v.charAt(0) + v.slice(1).toLowerCase()}
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
        <Label htmlFor="source">
          Source{' '}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          {...form.register('source')}
          id="source"
          name="source"
          placeholder="Referral, website, etc."
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="notes">
          Notes{' '}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Textarea {...form.register('notes')} id="notes" name="notes" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Cancel
          </Button>
        </DialogTrigger>
        <Button type="submit" size="sm" loading={isPending}>
          Add Contact
        </Button>
      </div>
    </form>
  )
}

export default ContactForm
