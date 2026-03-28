import { useNewContact } from '#/hooks/use-new-contact'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Button, buttonVariants } from '../ui/button'
import ContactForm from './contact-form'

function AddNewContact() {
  const { form, open, isPending, setOpen, onSubmit } = useNewContact()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: 'default', size: 'sm' })}
      >
        <Plus className="mr-2 size-4" />
        New Contact
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Contact</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new contact.
          </DialogDescription>
        </DialogHeader>

        <ContactForm
          form={form}
          onSubmit={onSubmit}
          isPending={isPending}
          actionButton={
            <Button type="submit" size="sm" loading={isPending}>
              Add Contact
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddNewContact
