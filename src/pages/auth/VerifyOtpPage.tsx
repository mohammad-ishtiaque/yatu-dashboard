import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { usePasswordResetStore } from '@/lib/store/passwordResetStore'
import { ROUTES } from '@/constants/routes'

const OTP_LENGTH = 6

export default function VerifyOtpPage() {
  const navigate        = useNavigate()
  const { email, setOtpVerified } = usePasswordResetStore()
  const [otp,       setOtp]       = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Guard: no email means the user navigated here directly
  useEffect(() => {
    if (!email) navigate(ROUTES.FORGOT_PASSWORD, { replace: true })
  }, [email, navigate])

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next  = [...otp]
    next[index] = digit
    setOtp(next)
    setError('')
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const next = [...otp]
      next[index - 1] = ''
      setOtp(next)
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((d, i) => { next[i] = d })
    setOtp(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  async function handleVerify() {
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits`)
      return
    }
    setIsLoading(true)
    try {
      // TODO: await api.auth.verifyOtp(email, code)
      await new Promise(r => setTimeout(r, 600))
      setOtpVerified(true)
      navigate(ROUTES.RESET_PASSWORD)
    } catch {
      setError('Invalid or expired code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResend() {
    if (!canResend) return
    // TODO: await api.auth.forgotPassword(email)
    await new Promise(r => setTimeout(r, 400))
    setOtp(Array(OTP_LENGTH).fill(''))
    setError('')
    setCountdown(60)
    setCanResend(false)
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-widest text-red-500 mb-1">YETU</h1>
            <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              We sent a reset code to{' '}
              <span className="font-medium text-gray-700">{email}</span>.
              Enter the {OTP_LENGTH}-digit code below.
            </p>
          </div>

          {/* OTP digit boxes */}
          <div
            className="flex items-center justify-center gap-2.5 mb-2"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-12 h-13 text-center text-xl font-semibold border-2 rounded-lg
                            focus:outline-none focus:ring-2 transition-all
                            ${error
                              ? 'border-red-400 bg-red-50 focus:ring-red-500/20'
                              : digit
                                ? 'border-red-400 bg-red-50/30 focus:ring-red-500/20'
                                : 'border-gray-300 focus:ring-red-500/20 focus:border-red-400'
                            }`}
                style={{ height: '3.25rem' }}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-xs text-red-500 mb-4">{error}</p>
          )}

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full mt-4 py-2.5 px-4 bg-red-500 hover:bg-red-600
                       disabled:bg-red-300 text-white text-sm font-semibold
                       rounded-lg transition-colors duration-200
                       flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            You have not received the email?{' '}
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Resend
              </button>
            ) : (
              <span className="text-gray-400">Resend in {countdown}s</span>
            )}
          </p>

          <div className="mt-5 text-center">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
