import { MUTATION_KEYS } from '#/constants/request-keys.consts'
import { signIn, signUp } from '#/lib/auth-client'
import type {
  LoginFormValues,
  RegisterFormValues,
} from '#/validations/auth.validations'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const useRegisterMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.REGISTER],
    mutationFn: async ({ email, password, name }: RegisterFormValues) => {
      const response = await signUp.email({ email, password, name })
      if (response.error) {
        toast.error(`Registration failed: ${response.error.message}`)
        return
      }

      toast.success('Registration successful.')
      navigate({ to: '/login' })
    },
  })
}

export const useLoginMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.LOGIN],
    mutationFn: async ({ email, password }: LoginFormValues) => {
      const response = await signIn.email({ email, password })
      if (response.error) {
        toast.error(`Login failed: ${response.error.message}`)
        return
      }

      toast.success('Login successful!')
      navigate({ to: '/' })
    },
  })
}
