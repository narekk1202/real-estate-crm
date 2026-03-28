import type { SerializedContacts } from '#/components/contacts/columns'
import { useEditContactMutation } from '#/services/mutations/contacts'
import { insertContactsSchema, type NewContact } from '@crm/api/src/db/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Row } from '@tanstack/react-table'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useEditContact = (contact: Row<SerializedContacts>) => {
  const [open, setOpen] = useState(false)

  const form = useForm<NewContact>({
    resolver: zodResolver(insertContactsSchema),
    defaultValues: {
      firstName: contact.original.firstName,
      lastName: contact.original.lastName,
      email: contact.original.email,
      phone: contact.original.phone,
      type: contact.original.type,
      status: contact.original.status,
      source: contact.original.source,
      notes: contact.original.notes,
    },
  })

  const editContact = useEditContactMutation()

  const onSubmit = (data: NewContact) => {
    editContact.mutate(
      { id: contact.original.id, data },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
        },
      },
    )
  }

  return {
    form,
    open,
    isPending: editContact.isPending,
    setOpen,
    onSubmit,
  }
}
