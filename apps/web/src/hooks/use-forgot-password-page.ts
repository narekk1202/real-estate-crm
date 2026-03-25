import { useForgotPasswordMutation } from '#/services/mutations/auth.mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const forgotPasswordFormValues = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormValues>

export const useForgotPasswordPage = () => {
  const forgotPasswordMutation = useForgotPasswordMutation()

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordFormValues),
  })

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(values.email)
  }

  return { form, onSubmit, isPending: forgotPasswordMutation.isPending }
}
