import { MUTATION_KEYS } from '#/constants/request-keys'
import { authClient, signIn, signOut, signUp } from '#/lib/auth-client'
import type { LoginFormValues, RegisterFormValues } from '#/validations/auth'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const useRegisterMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.REGISTER],
    mutationFn: async ({ email, password, name }: RegisterFormValues) => {
      const response = await signUp.email({ email, password, name })
      if (response.error) throw new Error(response.error.message)
      return response.data
    },
    onSuccess: () => {
      toast.success('Registration successful.')
      navigate({ to: '/login' })
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`)
    },
  })
}

export const useLoginMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.LOGIN],
    mutationFn: async ({ email, password }: LoginFormValues) => {
      const response = await signIn.email({ email, password })
      if (response.error) throw new Error(response.error.message)
      return response.data
    },
    onSuccess: () => {
      toast.success('Login successful!')
      navigate({ to: '/dashboard' })
    },
    onError: (error) => {
      toast.error(`Login failed: ${error.message}`)
    },
  })
}

export const useLogoutMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.LOGOUT],
    mutationFn: async () => {
      const response = await signOut()
      if (response.error) throw new Error(response.error.message)
      return response.data
    },
    onSuccess: () => {
      toast.success('Logged out successfully.')
      navigate({ to: '/login' })
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error.message}`)
    },
  })
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: [MUTATION_KEYS.RESET_PASSWORD],
    mutationFn: async (email: string) => {
      const response = await authClient.requestPasswordReset({
        email,
        redirectTo: new URL('/reset-password', globalThis.location.origin).href,
      })
      if (response.error) throw new Error(response.error.message)
      return response.data
    },
    onSuccess: () => {
      toast.success(
        'Password reset email sent. If an account with that email exists, you will receive a reset link shortly.',
      )
    },
    onError: (error) => {
      toast.error(`Password reset request failed: ${error.message}`)
    },
  })
}

export const useResetPasswordMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.CONFIRM_RESET_PASSWORD],
    mutationFn: async ({
      token,
      password,
    }: {
      password: string
      token: string
    }) => {
      const response = await authClient.resetPassword({
        token,
        newPassword: password,
      })
      if (response.error) throw new Error(response.error.message)
      return response.data
    },
    onSuccess: () => {
      toast.success('Password reset successfully. You can now log in.')
      navigate({ to: '/login' })
    },
    onError: (error) => {
      toast.error(`Password reset failed: ${error.message}`)
    },
  })
}
