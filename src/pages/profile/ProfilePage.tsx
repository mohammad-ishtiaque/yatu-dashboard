import { useState } from 'react'
import { Camera, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/lib/store/authStore'

// ─── Schemas ──────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Invalid email address'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ProfileForm   = z.infer<typeof profileSchema>
type PasswordForm  = z.infer<typeof passwordSchema>
type Tab = 'profile' | 'password'

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 placeholder:text-gray-300'
const errorCls = 'text-xs text-red-500 mt-1'

export default function ProfilePage() {
  const user = useAuthStore(s => s.user)
  const updateUser = useAuthStore(s => s.updateUser)

  const [tab,           setTab]          = useState<Tab>('profile')
  const [showCurrent,   setShowCurrent]  = useState(false)
  const [showNew,       setShowNew]      = useState(false)
  const [showConfirm,   setShowConfirm]  = useState(false)
  const [profileSaved,  setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  // split name into firstName / lastName
  const nameParts = user?.name.split(' ') ?? []
  const defaultFirstName = nameParts[0] ?? ''
  const defaultLastName  = nameParts.slice(1).join(' ')

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName:  defaultLastName,
      email:     user?.email ?? '',
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function handleProfileSubmit(data: ProfileForm) {
    // ── REAL API: await updateProfile({ name: `${data.firstName} ${data.lastName}`, email: data.email })
    const fullName = `${data.firstName} ${data.lastName}`.trim()
    updateUser({ name: fullName, email: data.email })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  async function handlePasswordSubmit(_data: PasswordForm) {
    // ── REAL API: await changePassword({ current: _data.currentPassword, new: _data.newPassword })
    setPasswordSaved(true)
    passwordForm.reset()
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar name={user?.name ?? 'Admin'} src={user?.avatarUrl} size="lg" className="w-20 h-20 text-xl" />
            <button
              className="absolute bottom-0 right-0 w-7 h-7 bg-red-500 rounded-full flex items-center
                         justify-center text-white shadow-md hover:bg-red-600 transition-colors"
              title="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-gray-900">{user?.name}</h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-6">
          {(['profile', 'password'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 pb-3 text-sm font-medium transition-colors capitalize ${
                tab === t
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {t === 'profile' ? 'Edit Profile' : 'Change Password'}
            </button>
          ))}
        </div>

        {/* Edit Profile */}
        {tab === 'profile' && (
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900 text-center mb-5">Edit Your Profile</h4>

            <Field label="First Name">
              <input
                type="text"
                placeholder="Bessie"
                className={inputCls}
                {...profileForm.register('firstName')}
              />
              {profileForm.formState.errors.firstName && (
                <p className={errorCls}>{profileForm.formState.errors.firstName.message}</p>
              )}
            </Field>

            <Field label="Last Name">
              <input
                type="text"
                placeholder="Kabir"
                className={inputCls}
                {...profileForm.register('lastName')}
              />
              {profileForm.formState.errors.lastName && (
                <p className={errorCls}>{profileForm.formState.errors.lastName.message}</p>
              )}
            </Field>

            <Field label="Email">
              <input
                type="email"
                placeholder="mobileip@mac.com"
                className={inputCls}
                {...profileForm.register('email')}
              />
              {profileForm.formState.errors.email && (
                <p className={errorCls}>{profileForm.formState.errors.email.message}</p>
              )}
            </Field>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={profileForm.formState.isSubmitting}
            >
              {profileSaved ? 'Saved!' : 'Save Changes'}
            </Button>
          </form>
        )}

        {/* Change Password */}
        {tab === 'password' && (
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900 text-center mb-5">Change Password</h4>

            <Field label="Current Password">
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className={inputCls}
                  {...passwordForm.register('currentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className={errorCls}>{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </Field>

            <Field label="New Password">
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className={inputCls}
                  {...passwordForm.register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className={errorCls}>{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </Field>

            <Field label="Confirm New Password">
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={inputCls}
                  {...passwordForm.register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className={errorCls}>{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </Field>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={passwordForm.formState.isSubmitting}
            >
              {passwordSaved ? 'Password Changed!' : 'Update Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
