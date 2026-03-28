import { useDeleteContactMutation } from '#/services/mutations/contacts'
import type { Row } from '@tanstack/react-table'
import { Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import type { SerializedContacts } from './columns'

interface DeleteContactProps {
  row: Row<SerializedContacts>
}

function DeleteContact({ row }: Readonly<DeleteContactProps>) {
  const deleteContact = useDeleteContactMutation()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon-sm" variant="destructive">
          <Trash className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contact</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteContact.mutate(row.original.id)}
            disabled={deleteContact.isPending}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteContact
