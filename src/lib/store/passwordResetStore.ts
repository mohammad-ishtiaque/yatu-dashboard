import { create } from 'zustand'

interface PasswordResetState {
  email: string
  otpVerified: boolean
  setEmail: (email: string) => void
  setOtpVerified: (verified: boolean) => void
  reset: () => void
}

export const usePasswordResetStore = create<PasswordResetState>()((set) => ({
  email: '',
  otpVerified: false,

  setEmail: (email) => set({ email }),
  setOtpVerified: (otpVerified) => set({ otpVerified }),
  reset: () => set({ email: '', otpVerified: false }),
}))
