import { create } from 'zustand'
import type { Notification } from '@/types'

interface NotificationState {
  notifications: Notification[]
  markRead: (id: string) => void
  markAllRead: () => void
}

const now = Date.now()
const mins  = (n: number) => new Date(now - n * 60 * 1000).toISOString()
const hours = (n: number) => new Date(now - n * 60 * 60 * 1000).toISOString()
const days  = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString()

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'new_user',
    title: 'New user registered',
    message: 'Alice Johnson just created an account.',
    timestamp: mins(5),
    read: false,
  },
  {
    id: 'n2',
    type: 'booking_created',
    title: 'New booking placed',
    message: 'Booking #BK-1042 was placed by Marcus Lee.',
    timestamp: mins(18),
    read: false,
  },
  {
    id: 'n3',
    type: 'booking_completed',
    title: 'Booking completed',
    message: 'Booking #BK-1038 has been completed successfully.',
    timestamp: mins(45),
    read: false,
  },
  {
    id: 'n4',
    type: 'new_rider',
    title: 'New rider onboarded',
    message: 'Carlos Rivera completed onboarding and is now active.',
    timestamp: hours(2),
    read: false,
  },
  {
    id: 'n5',
    type: 'rider_suspended',
    title: 'Rider suspended',
    message: 'Rider David Kim was suspended due to a policy violation.',
    timestamp: hours(3),
    read: false,
  },
  {
    id: 'n6',
    type: 'support_message',
    title: 'New support request',
    message: 'A user submitted a support request about a payment issue.',
    timestamp: hours(4),
    read: false,
  },
  {
    id: 'n7',
    type: 'booking_cancelled',
    title: 'Booking cancelled',
    message: 'Booking #BK-1035 was cancelled by the user.',
    timestamp: hours(5),
    read: true,
  },
  {
    id: 'n8',
    type: 'bike_maintenance',
    title: 'Bike due for service',
    message: 'Yamaha MT-15 (KA-01-AB-1234) is overdue for maintenance.',
    timestamp: hours(8),
    read: true,
  },
  {
    id: 'n9',
    type: 'low_stock',
    title: 'Low bike availability',
    message: 'Only 2 bikes are currently available in Zone A.',
    timestamp: hours(10),
    read: true,
  },
  {
    id: 'n10',
    type: 'content_published',
    title: 'Privacy Policy updated',
    message: 'The Privacy Policy was published successfully.',
    timestamp: days(2),
    read: true,
  },
]

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}))
