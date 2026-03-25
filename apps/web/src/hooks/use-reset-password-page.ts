import { useResetPasswordMutation } from '#/services/mutations/auth.mutations'
import {
  resetPasswordValidationSchema,
  type ResetPasswordFormValues,
} from '#/validations/auth.validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useResetPasswordPage = (token: string) => {
  const resetPasswordMutation = useResetPasswordMutation()

  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordValidationSchema),
  })

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate({ token, password: data.password })
  }

  return { form, onSubmit, isPending: resetPasswordMutation.isPending }
}
