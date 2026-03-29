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
import PropertyForm from './property-form'
import { useNewProperty } from '#/hooks/use-new-property'

function AddNewProperty() {
  const { form, open, isPending, setOpen, onSubmit } = useNewProperty()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: 'default', size: 'sm' })}
      >
        <Plus className="mr-2 size-4" />
        Add property
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Property</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new property listing.
          </DialogDescription>
        </DialogHeader>

        <PropertyForm
          form={form}
          onSubmit={onSubmit}
          actionButton={
            <Button type="submit" size="sm" loading={isPending}>
              Add Property
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddNewProperty
