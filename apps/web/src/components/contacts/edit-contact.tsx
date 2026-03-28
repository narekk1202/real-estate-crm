import { useEditContact } from '#/hooks/use-edit-contact'
import type { Row } from '@tanstack/react-table'
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
import type { SerializedContacts } from './columns'
import ContactForm from './contact-form'

interface EditContactProps {
  row: Row<SerializedContacts>
}

function EditContact({ row }: Readonly<EditContactProps>) {
  const { form, open, isPending, setOpen, onSubmit } = useEditContact(row)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: 'default', size: 'icon' })}
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
          isPending={isPending}
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
