import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { usePasswordResetStore } from '@/lib/store/passwordResetStore'
import { ROUTES } from '@/constants/routes'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const navigate  = useNavigate()
  const setEmail  = usePasswordResetStore(s => s.setEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    setServerError('')
    try {
      // TODO: await api.auth.forgotPassword(data.email)
      await new Promise(r => setTimeout(r, 600))
      setEmail(data.email)
      navigate(ROUTES.VERIFY_OTP)
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-widest text-red-500 mb-1">YETU</h1>
            <h2 className="text-xl font-semibold text-gray-900">Forget Password?</h2>
            <p className="text-sm text-gray-500 mt-1">
              Please enter your email to get verification code
            </p>
          </div>

          {serverError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                autoFocus
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg
                            focus:outline-none focus:ring-2 transition-all
                            ${errors.email
                              ? 'border-red-400 focus:ring-red-500/20'
                              : 'border-gray-300 focus:ring-red-500/20 focus:border-red-400'
                            }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
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
              {isLoading ? 'Sending...' : 'Continue'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
