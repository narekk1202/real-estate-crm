import { useEditContact } from '#/hooks/use-edit-contact'
import type { Contact } from '@crm/shared'
import { Edit } from 'lucide-react'
import { Button, buttonVariants } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import ContactForm from './contact-form'

interface EditContactProps {
  contact: Contact
}

function EditContact({ contact }: Readonly<EditContactProps>) {
  const { form, open, isPending, setOpen, onSubmit } = useEditContact(contact)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: 'default', size: 'icon-sm' })}
      >
        <Edit className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>
            Fill out the form below to edit the contact.
          </DialogDescription>
        </DialogHeader>

        <ContactForm
          form={form}
          onSubmit={onSubmit}
          actionButton={
            <Button type="submit" size="sm" loading={isPending}>
              Save Changes
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditContact
