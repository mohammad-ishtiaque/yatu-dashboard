import type {
  User, Rider, Bike, Booking,
  DashboardStats, GrowthDataPoint
} from '@/types'

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalRiders:  75,
  totalUsers:   1576,
  totalBikes:   75,
  activeUsers:  870,
  activeDrivers: 110,
}

// ─── Growth Chart Data ────────────────────────────────────────────────────────
export const mockGrowthData: GrowthDataPoint[] = [
  { month: 'Jan', users: 120, riders: 8  },
  { month: 'Feb', users: 195, riders: 12 },
  { month: 'Mar', users: 160, riders: 10 },
  { month: 'Apr', users: 280, riders: 18 },
  { month: 'May', users: 240, riders: 15 },
  { month: 'Jun', users: 330, riders: 22 },
  { month: 'Jul', users: 210, riders: 14 },
  { month: 'Aug', users: 410, riders: 28 },
  { month: 'Sep', users: 300, riders: 20 },
  { month: 'Oct', users: 450, riders: 32 },
  { month: 'Nov', users: 380, riders: 25 },
  { month: 'Dec', users: 500, riders: 38 },
]

// ─── Users ────────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'u1', name: 'Theodore Vasclub', email: 'theo@yandex.ru',    phone: '901-476-9365', status: 'active',   role: 'user',  joinedAt: '2025-01-10' },
  { id: 'u2', name: 'Russell Vaum',     email: 'rvaum@pharma.com',  phone: '985-842-7585', status: 'inactive', role: 'user',  joinedAt: '2025-01-10' },
  { id: 'u3', name: 'Tracy Brady',      email: 'tbrady@yandex.ru',  phone: '584-987-5097', status: 'active',   role: 'user',  joinedAt: '2025-01-10' },
  { id: 'u4', name: 'Dana Daniel',      email: 'ddaniel@yandex.ru', phone: '465-260-4366', status: 'active',   role: 'user',  joinedAt: '2025-01-10' },
  { id: 'u5', name: 'Amara Osei',       email: 'amara@gmail.com',   phone: '712-334-8820', status: 'active',   role: 'user',  joinedAt: '2025-01-15' },
  { id: 'u6', name: 'Kofi Mensah',      email: 'kofi@mensah.gh',    phone: '233-555-0112', status: 'active',   role: 'user',  joinedAt: '2025-01-18' },
  { id: 'u7', name: 'Zara Nkomo',       email: 'zara@nkomo.co.za',  phone: '271-800-4455', status: 'suspended',role: 'user',  joinedAt: '2025-01-20' },
  { id: 'u8', name: 'Ibrahim Diallo',   email: 'ibrahim@diallo.sn', phone: '221-776-5500', status: 'active',   role: 'user',  joinedAt: '2025-01-22' },
  { id: 'u9', name: 'Fatima Al-Rashid', email: 'fatima@rashid.ng',  phone: '234-802-7733', status: 'inactive', role: 'user',  joinedAt: '2025-01-25' },
  { id: 'u10',name: 'Emeka Okafor',     email: 'emeka@okafor.ng',   phone: '234-901-2288', status: 'active',   role: 'user',  joinedAt: '2025-01-28' },
  { id: 'u11',name: 'Aisha Kamara',     email: 'aisha@kamara.sl',   phone: '232-777-4421', status: 'active',   role: 'user',  joinedAt: '2025-02-01' },
  { id: 'u12',name: 'Chidi Eze',        email: 'chidi@eze.ng',      phone: '234-803-5566', status: 'active',   role: 'user',  joinedAt: '2025-02-03' },
]

// ─── Riders ───────────────────────────────────────────────────────────────────
export const mockRiders: Rider[] = [
  { id: 'r1', name: 'Kwame Asante',    email: 'kwame@asante.gh',   phone: '233-244-7788', status: 'active',   totalTrips: 142, rating: 4.8, joinedAt: '2024-11-05' },
  { id: 'r2', name: 'Tunde Adeyemi',   email: 'tunde@adeyemi.ng',  phone: '234-801-3344', status: 'on_trip',  totalTrips: 98,  rating: 4.6, joinedAt: '2024-11-12' },
  { id: 'r3', name: 'Moses Githinji',  email: 'moses@githinji.ke', phone: '254-722-5544', status: 'active',   totalTrips: 210, rating: 4.9, joinedAt: '2024-10-20' },
  { id: 'r4', name: 'Seun Bello',      email: 'seun@bello.ng',     phone: '234-806-9988', status: 'inactive', totalTrips: 34,  rating: 4.2, joinedAt: '2024-12-01' },
  { id: 'r5', name: 'Nana Boateng',    email: 'nana@boateng.gh',   phone: '233-266-1122', status: 'active',   totalTrips: 178, rating: 4.7, joinedAt: '2024-10-08' },
]

// ─── Bikes ────────────────────────────────────────────────────────────────────
export const mockBikes: Bike[] = [
  { id: 'b1', model: 'Yamaha FZ 150',    plateNumber: 'GH-1234-AB', status: 'available',   location: 'Accra Central',  lastServiceDate: '2025-01-10' },
  { id: 'b2', model: 'Honda CB 125',     plateNumber: 'GH-5678-CD', status: 'in_use',      location: 'Osu',            lastServiceDate: '2025-01-05' },
  { id: 'b3', model: 'Bajaj Pulsar 150', plateNumber: 'GH-9012-EF', status: 'maintenance', location: 'Workshop',       lastServiceDate: '2024-12-20' },
  { id: 'b4', model: 'TVS Apache 160',   plateNumber: 'GH-3456-GH', status: 'available',   location: 'Airport Area',   lastServiceDate: '2025-01-15' },
  { id: 'b5', model: 'Suzuki GS 150',    plateNumber: 'GH-7890-IJ', status: 'available',   location: 'Tema',           lastServiceDate: '2025-01-08' },
]

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const mockBookings: Booking[] = [
  { id: 'bk1', userId: 'u1', riderId: 'r1', bikeId: 'b1', status: 'completed',   pickupLocation: 'Accra Mall',    dropoffLocation: 'Airport',    fare: 45.00, createdAt: '2025-01-20T10:00:00Z', completedAt: '2025-01-20T10:35:00Z' },
  { id: 'bk2', userId: 'u3', riderId: 'r2', bikeId: 'b2', status: 'in_progress', pickupLocation: 'Osu Market',    dropoffLocation: 'Labone',     fare: 22.50, createdAt: '2025-01-28T14:15:00Z' },
  { id: 'bk3', userId: 'u5', riderId: 'r3', bikeId: 'b4', status: 'confirmed',   pickupLocation: 'East Legon',    dropoffLocation: 'Ring Road',  fare: 35.00, createdAt: '2025-01-28T15:00:00Z' },
  { id: 'bk4', userId: 'u2', riderId: 'r4', bikeId: 'b5', status: 'cancelled',   pickupLocation: 'Tema Station',  dropoffLocation: 'Community 9',fare: 0,     createdAt: '2025-01-27T09:00:00Z' },
  { id: 'bk5', userId: 'u4', riderId: 'r5', bikeId: 'b1', status: 'pending',     pickupLocation: 'Madina Market', dropoffLocation: 'Adenta',     fare: 28.00, createdAt: '2025-01-28T16:30:00Z' },
]
