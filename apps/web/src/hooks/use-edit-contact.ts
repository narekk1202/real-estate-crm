import { useEditContactMutation } from '#/services/mutations/contacts'
import { insertContactSchema, type Contact, type NewContact } from '@crm/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useEditContact = (contact: Contact) => {
  const [open, setOpen] = useState(false)

  const form = useForm<NewContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      type: contact.type,
      status: contact.status,
      source: contact.source,
      notes: contact.notes,
    },
  })

  const handleOpenChange = (value: boolean) => {
    if (value) {
      form.reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        status: contact.status,
        source: contact.source,
        notes: contact.notes,
      })
    }
    setOpen(value)
  }

  const editContact = useEditContactMutation()

  const onSubmit = (data: NewContact) => {
    editContact.mutate(
      { id: contact.id, data },
      {
        onSuccess: () => {
          setOpen(false)
        },
      },
    )
  }

  return {
    form,
    open,
    isPending: editContact.isPending,
    setOpen: handleOpenChange,
    onSubmit,
  }
}
