import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

function FieldError<T extends FieldValues>({
  field,
  form,
}: Readonly<{
  field: FieldPath<T>
  form: UseFormReturn<T>
}>) {
  return (
    <div className="text-sm text-red-500 mt-1">
      {form.formState.errors[field]?.message as string}
    </div>
  )
}

export default FieldError
