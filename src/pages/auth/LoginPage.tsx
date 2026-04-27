import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { ROUTES } from '@/constants/routes'
import { logger } from '@/lib/utils/logger'

// ─── Zod validation schema ─────────────────────────────────────────────────────
// Why Zod? It gives us:
// 1. Runtime validation (catches bad inputs)
// 2. TypeScript types inferred automatically (no duplication)
// 3. Readable error messages out of the box
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

// TypeScript type is INFERRED from schema — no manual interface needed
type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const login     = useAuthStore((s) => s.login)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading,    setIsLoading]    = useState(false)
  const [serverError,  setServerError]  = useState('')
  const passwordReset = (location.state as { passwordReset?: boolean } | null)?.passwordReset ?? false

  // React Hook Form + Zod — handles:
  // register: connects input to form state
  // handleSubmit: validates before calling our handler
  // formState.errors: per-field error messages from Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)
    setServerError('')

    try {
      logger.info('Login attempt', { email: data.email })

      // ── DUMMY auth — swap this block for real API call ──
      await new Promise(r => setTimeout(r, 800)) // simulate network
      if (data.email === 'admin@yetu.com' && data.password === 'password') {
        login('mock-jwt-token-12345', {
          id: 'admin-1',
          name: 'Jane Cooper',
          email: data.email,
          role: 'admin',
        })
        logger.info('Login success')
        navigate(ROUTES.DASHBOARD, { replace: true })
      } else {
        throw new Error('Invalid email or password')
      }
      // ── End dummy auth ───────────────────────────────────

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setServerError(msg)
      logger.warn('Login failed', { email: data.email, error: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-widest text-red-500 mb-1">
              YETU
            </h1>
            <h2 className="text-xl font-semibold text-gray-900">Login to Account</h2>
            <p className="text-sm text-gray-500 mt-1">
              Please enter your email and password to continue
            </p>
          </div>

          {/* Password reset success */}
          {passwordReset && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200
                            rounded-lg text-sm text-green-700">
              Password reset successfully. You can now sign in.
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200
                            rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Form — note: no <form> wrapping inputs, using handleSubmit */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                  className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm border rounded-lg
                              focus:outline-none focus:ring-2 transition-all
                              ${errors.password
                                ? 'border-red-400 focus:ring-red-500/20'
                                : 'border-gray-300 focus:ring-red-500/20 focus:border-red-400'
                              }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-red-500
                           focus:ring-red-500/20 cursor-pointer"
              />
              <span className="text-sm text-gray-600">Remember Password</span>
            </label>

            {/* Submit */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600
                         disabled:bg-red-300 text-white text-sm font-semibold
                         rounded-lg transition-colors duration-200
                         flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Dev hint */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Dev: admin@yetu.com / password
          </p>
        </div>
      </div>
    </div>
  )
}
