import { useEditProperty } from '#/hooks/use-edit-property'
import type { Property } from '@crm/shared'
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
import PropertyForm from './property-form'

interface EditPropertyProps {
  property: Property
}

function EditProperty({ property }: Readonly<EditPropertyProps>) {
  const { form, files, setFiles, open, isPending, setOpen, onSubmit } =
    useEditProperty(property)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
      >
        <Edit className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Fill out the form below to update the property listing.
          </DialogDescription>
        </DialogHeader>

        <PropertyForm
          form={form}
          onSubmit={onSubmit}
          files={files}
          onFilesChange={setFiles}
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

export default EditProperty
