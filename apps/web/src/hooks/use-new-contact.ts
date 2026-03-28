import { useNewContactMutation } from '#/services/mutations/contacts'
import { insertContactsSchema, type NewContact } from '@crm/api/src/db/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useNewContact = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<NewContact>({
    resolver: zodResolver(insertContactsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      type: 'LEAD',
      status: 'ACTIVE',
      source: '',
      notes: '',
    },
  })

  const newContact = useNewContactMutation()

  const onSubmit = (data: NewContact) => {
    newContact.mutate(data, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      },
    })
  }

  return {
    form,
    open,
    isPending: newContact.isPending,
    setOpen,
    onSubmit,
  }
}
