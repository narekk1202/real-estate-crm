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
      navigate({ to: '/dashboard' })
    },
  })
}

export const useLogoutMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.LOGOUT],
    mutationFn: async () => {
      const response = await signOut()
      if (response.error) {
        toast.error(`Logout failed: ${response.error.message}`)
        return
      }

      toast.success('Logged out successfully.')
      navigate({ to: '/login' })
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
      if (response.error) {
        toast.error(`Password reset failed: ${response.error.message}`)
        return
      }

      toast.success(
        'Password reset email sent. If an account with that email exists, you will receive a reset link shortly.',
      )
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
      if (response.error) {
        toast.error(`Password reset failed: ${response.error.message}`)
        return
      }

      toast.success('Password reset successfully. You can now log in.')
      navigate({ to: '/login' })
    },
  })
}
