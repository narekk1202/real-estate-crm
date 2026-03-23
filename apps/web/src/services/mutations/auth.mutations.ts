import { MUTATION_KEYS } from '#/constants/request-keys.consts'
import { signUp } from '#/lib/auth-client'
import type { RegisterFormValues } from '#/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const useRegisterMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.REGISTER],
    mutationFn: ({ email, password, name }: RegisterFormValues) =>
      signUp.email({ email, password, name }),
    onSuccess: () => {
      toast.success('Registration successful, you can now log in!')
      navigate({ to: '/login' })
    },
  })
}
