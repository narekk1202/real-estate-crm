import { MUTATION_KEYS } from '#/constants/request-keys.consts'
import { signUp } from '#/lib/auth-client'
import type { RegisterFormValues } from '#/types/auth.types'
import { useMutation } from '@tanstack/react-query'

export const useRegisterMutation = () =>
  useMutation({
    mutationKey: [MUTATION_KEYS.REGISTER],
    mutationFn: ({ email, password, name }: RegisterFormValues) =>
      signUp.email({ email, password, name }),
  })
