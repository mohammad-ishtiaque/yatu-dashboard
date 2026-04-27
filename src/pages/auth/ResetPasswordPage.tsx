import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { usePasswordResetStore } from '@/lib/store/passwordResetStore'
import { ROUTES } from '@/constants/routes'

const schema = z
  .object({
    newPassword:     z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const navigate                  = useNavigate()
  const { otpVerified, reset }    = usePasswordResetStore()
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading,   setIsLoading]   = useState(false)

  // Guard: cannot land here without completing OTP step
  useEffect(() => {
    if (!otpVerified) navigate(ROUTES.FORGOT_PASSWORD, { replace: true })
  }, [otpVerified, navigate])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      // TODO: await api.auth.resetPassword({ password: data.newPassword })
      await new Promise(r => setTimeout(r, 600))
      reset() // clear all password-reset state
      navigate(ROUTES.LOGIN, { state: { passwordReset: true } })
    } finally {
      setIsLoading(false)
    }
  }

  function inputCls(hasError: boolean) {
    return [
      'w-full px-3.5 py-2.5 pr-10 text-sm border rounded-lg',
      'focus:outline-none focus:ring-2 transition-all',
      hasError
        ? 'border-red-400 focus:ring-red-500/20'
        : 'border-gray-300 focus:ring-red-500/20 focus:border-red-400',
    ].join(' ')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-widest text-red-500 mb-1">YETU</h1>
            <h2 className="text-xl font-semibold text-gray-900">Set a new password</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new password. Ensure it differs from previous ones for security.
            </p>
          </div>

          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register('newPassword')}
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoFocus
                  className={inputCls(!!errors.newPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={inputCls(!!errors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600
                         disabled:bg-red-300 text-white text-sm font-semibold
                         rounded-lg transition-colors duration-200
                         flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
