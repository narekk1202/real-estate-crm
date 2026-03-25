import { useRegisterMutation } from '#/services/mutations/auth'
import {
  registerValidationSchema,
  type RegisterFormValues,
} from '#/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useRegisterPage = () => {
  const registerMutation = useRegisterMutation()

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    resolver: zodResolver(registerValidationSchema),
  })

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data)
  }

  return { form, onSubmit, isPending: registerMutation.isPending }
}
