import { useLoginMutation } from '#/services/mutations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  loginValidationSchema,
  type LoginFormValues,
} from '../validations/auth'

export const useLoginPage = () => {
  const loginMutation = useLoginMutation()

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginValidationSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  return { form, onSubmit, isPending: loginMutation.isPending }
}
