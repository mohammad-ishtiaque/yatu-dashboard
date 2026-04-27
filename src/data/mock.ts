import type {
  User, Rider, Bike, Booking,
  DashboardStats, GrowthDataPoint, FAQ, ContentPage
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
  { id: 'u1',  name: 'Theodore Vasclub', email: 'theo@yandex.ru',    phone: '901-476-9365', status: 'active',    role: 'user',  joinedAt: '2025-01-10' },
  { id: 'u2',  name: 'Russell Vaum',     email: 'rvaum@pharma.com',  phone: '985-842-7585', status: 'inactive',  role: 'user',  joinedAt: '2025-01-10' },
  { id: 'u3',  name: 'Tracy Brady',      email: 'tbrady@yandex.ru',  phone: '584-987-5097', status: 'active',    role: 'user',  joinedAt: '2025-01-10' },
  { id: 'u4',  name: 'Dana Daniel',      email: 'ddaniel@yandex.ru', phone: '465-260-4366', status: 'active',    role: 'user',  joinedAt: '2025-01-10' },
  { id: 'u5',  name: 'Amara Osei',       email: 'amara@gmail.com',   phone: '712-334-8820', status: 'active',    role: 'user',  joinedAt: '2025-01-15' },
  { id: 'u6',  name: 'Kofi Mensah',      email: 'kofi@mensah.gh',    phone: '233-555-0112', status: 'active',    role: 'user',  joinedAt: '2025-01-18' },
  { id: 'u7',  name: 'Zara Nkomo',       email: 'zara@nkomo.co.za',  phone: '271-800-4455', status: 'suspended', role: 'user',  joinedAt: '2025-01-20' },
  { id: 'u8',  name: 'Ibrahim Diallo',   email: 'ibrahim@diallo.sn', phone: '221-776-5500', status: 'active',    role: 'user',  joinedAt: '2025-01-22' },
  { id: 'u9',  name: 'Fatima Al-Rashid', email: 'fatima@rashid.ng',  phone: '234-802-7733', status: 'inactive',  role: 'user',  joinedAt: '2025-01-25' },
  { id: 'u10', name: 'Emeka Okafor',     email: 'emeka@okafor.ng',   phone: '234-901-2288', status: 'active',    role: 'user',  joinedAt: '2025-01-28' },
  { id: 'u11', name: 'Aisha Kamara',     email: 'aisha@kamara.sl',   phone: '232-777-4421', status: 'active',    role: 'user',  joinedAt: '2025-02-01' },
  { id: 'u12', name: 'Chidi Eze',        email: 'chidi@eze.ng',      phone: '234-803-5566', status: 'active',    role: 'user',  joinedAt: '2025-02-03' },
]

// ─── Riders ───────────────────────────────────────────────────────────────────
export const mockRiders: Rider[] = [
  { id: 'r1', name: 'Kwame Asante',   email: 'kwame@asante.gh',   phone: '233-244-7788', status: 'active',    totalTrips: 142, rating: 4.8, joinedAt: '2024-11-05', vehicleType: 'Motorcycle', licenseNumber: 'GH-LIC-001', address: 'Accra, Ghana' },
  { id: 'r2', name: 'Tunde Adeyemi',  email: 'tunde@adeyemi.ng',  phone: '234-801-3344', status: 'on_trip',   totalTrips: 98,  rating: 4.6, joinedAt: '2024-11-12', vehicleType: 'Motorcycle', licenseNumber: 'NG-LIC-002', address: 'Lagos, Nigeria' },
  { id: 'r3', name: 'Moses Githinji', email: 'moses@githinji.ke', phone: '254-722-5544', status: 'active',    totalTrips: 210, rating: 4.9, joinedAt: '2024-10-20', vehicleType: 'Motorcycle', licenseNumber: 'KE-LIC-003', address: 'Nairobi, Kenya' },
  { id: 'r4', name: 'Seun Bello',     email: 'seun@bello.ng',     phone: '234-806-9988', status: 'inactive',  totalTrips: 34,  rating: 4.2, joinedAt: '2024-12-01', vehicleType: 'Motorcycle', licenseNumber: 'NG-LIC-004', address: 'Abuja, Nigeria' },
  { id: 'r5', name: 'Nana Boateng',   email: 'nana@boateng.gh',   phone: '233-266-1122', status: 'active',    totalTrips: 178, rating: 4.7, joinedAt: '2024-10-08', vehicleType: 'Motorcycle', licenseNumber: 'GH-LIC-005', address: 'Kumasi, Ghana' },
  { id: 'r6', name: 'Akin Adeleke',   email: 'akin@adeleke.ng',   phone: '234-702-8899', status: 'suspended', totalTrips: 55,  rating: 3.8, joinedAt: '2024-12-15', vehicleType: 'Motorcycle', licenseNumber: 'NG-LIC-006', address: 'Port Harcourt, Nigeria' },
]

// ─── Bikes ────────────────────────────────────────────────────────────────────
export const mockBikes: Bike[] = [
  { id: 'b1', brand: 'Boda Boda', model: 'KDA 458 BK', plateNumber: 'A89BT', color: 'Midnight Silver Metallic', year: 2022, status: 'available',   location: 'Accra Central', lastServiceDate: '2025-01-10', assignedRider: { id: 'r1', name: 'Marvin McKinney' } },
  { id: 'b2', brand: 'Boda Boda', model: 'KDA 458 BK', plateNumber: 'A89BT', color: 'Midnight Silver Metallic', year: 2022, status: 'in_use',      location: 'Osu',           lastServiceDate: '2025-01-05', assignedRider: { id: 'r2', name: 'Marvin McKinney' } },
  { id: 'b3', brand: 'Achaba',    model: 'KDA 458 BK', plateNumber: 'A89BT', color: 'Midnight Silver Metallic', year: 2021, status: 'maintenance', location: 'Workshop',       lastServiceDate: '2024-12-20', assignedRider: null },
  { id: 'b4', brand: 'Achaba',    model: 'KDA 458 BK', plateNumber: 'A89BT', color: 'Midnight Silver Metallic', year: 2023, status: 'available',   location: 'Airport Area',  lastServiceDate: '2025-01-15', assignedRider: { id: 'r3', name: 'Marvin McKinney' } },
  { id: 'b5', brand: 'Achaba',    model: 'KDA 458 BK', plateNumber: 'A89BT', color: 'Midnight Silver Metallic', year: 2022, status: 'available',   location: 'Tema',           lastServiceDate: '2025-01-08', assignedRider: { id: 'r5', name: 'Marvin McKinney' } },
  { id: 'b6', brand: 'Achaba',    model: 'KDA 458 BK', plateNumber: 'A89BT', color: 'Midnight Silver Metallic', year: 2023, status: 'in_use',      location: 'East Legon',    lastServiceDate: '2025-01-12', assignedRider: { id: 'r1', name: 'Marvin McKinney' } },
]

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const mockBookings: Booking[] = [
  { id: 'bk1', userId: 'u1', riderId: 'r1', bikeId: 'b1', status: 'completed',   pickupLocation: 'Accra Mall',    dropoffLocation: 'Airport',     fare: 45.00, createdAt: '2025-01-20T10:00:00Z', completedAt: '2025-01-20T10:35:00Z' },
  { id: 'bk2', userId: 'u3', riderId: 'r2', bikeId: 'b2', status: 'in_progress', pickupLocation: 'Osu Market',    dropoffLocation: 'Labone',      fare: 22.50, createdAt: '2025-01-28T14:15:00Z' },
  { id: 'bk3', userId: 'u5', riderId: 'r3', bikeId: 'b4', status: 'confirmed',   pickupLocation: 'East Legon',    dropoffLocation: 'Ring Road',   fare: 35.00, createdAt: '2025-01-28T15:00:00Z' },
  { id: 'bk4', userId: 'u2', riderId: 'r4', bikeId: 'b5', status: 'cancelled',   pickupLocation: 'Tema Station',  dropoffLocation: 'Community 9', fare: 0,     createdAt: '2025-01-27T09:00:00Z' },
  { id: 'bk5', userId: 'u4', riderId: 'r5', bikeId: 'b1', status: 'pending',     pickupLocation: 'Madina Market', dropoffLocation: 'Adenta',      fare: 28.00, createdAt: '2025-01-28T16:30:00Z' },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const mockFaqs: FAQ[] = [
  {
    id: 'faq1',
    question: 'How do I book an appointment?',
    answer: 'Fill in the required details, including your full name, email address, and a secure password. Ensure your email is valid as it will be used for account verification and communication.',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
  },
  {
    id: 'faq2',
    question: 'How do I cancel a booking?',
    answer: 'Go to your bookings section, select the booking you wish to cancel, and click the "Cancel" button. Cancellations are free if done at least 30 minutes before the scheduled pickup.',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
  },
  {
    id: 'faq3',
    question: 'How are payments processed?',
    answer: 'Payments are processed securely through our platform. We accept mobile money, credit/debit cards, and cash on delivery. Your payment details are encrypted and never stored on our servers.',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
  },
  {
    id: 'faq4',
    question: 'How do I track my rider?',
    answer: 'Once your booking is confirmed, you can track your rider in real-time through the mobile app. You will receive live updates on their location and estimated time of arrival.',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
  },
  {
    id: 'faq5',
    question: 'What happens if my rider is late?',
    answer: 'If your rider is more than 10 minutes late, you will receive an automatic notification with an updated ETA. You may also contact the rider directly through the in-app chat feature.',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
  },
]

// ─── Content Pages ────────────────────────────────────────────────────────────
const privacyContent = `<h2>Privacy Policy</h2><p>Welcome to iLera . These Terms and Conditions ("Terms") govern your use of our services provided through the App. By accessing or using the App, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, you should not use the App.</p><p>Services</p><p>iLera allows users to book appointments with healthcare providers. We facilitate the booking process but are not responsible for the medical services provided by healthcare professionals. All medical services are provided by independent healthcare professionals.</p><h3>User Responsibilities</h3><ol><li><p><strong>Account Creation:</strong> To use certain features of the App, you may need to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p></li><li><p><strong>Confidentiality:</strong> You are responsible for maintaining the confidentiality of your account information and password. You agree to notify us immediately of any unauthorized use of your account.</p></li><li><p><strong>Use of Services:</strong> You agree to use the App only for lawful purposes and in accordance with these Terms. You will not use the App in any way that could damage, disable, overburden, or impair the App or interfere with any other party's use of the App.</p></li></ol><h3>Appointments and Cancellations</h3><ol><li><p><strong>Booking:</strong> By booking an appointment through the App, you agree to provide accurate information. The healthcare provider has the right to accept or decline your appointment request.</p></li><li><p><strong>Cancellations:</strong> If you need to cancel an appointment, you must do so according to the cancellation policy of the healthcare provider. Failure to cancel within the stipulated time may result in a cancellation fee.</p></li></ol><h3>Payments</h3><ol><li><p><strong>Fees:</strong> Any fees for services provided through the App are set by the healthcare providers. The App may facilitate the payment process but is not responsible for the services provided.</p></li><li><p><strong>Payment Information:</strong> You agree to provide valid payment information and authorize the App to charge your payment method for the services provided by the healthcare provider.</p></li></ol>`

const termsContent = `<h2>Terms and Conditions</h2><h3>Introduction</h3><p>Welcome to iLera . These Terms and Conditions ("Terms") govern your use of our services provided through the App. By accessing or using the App, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, you should not use the App.</p><p>Services</p><p>iLera allows users to book appointments with healthcare providers. We facilitate the booking process but are not responsible for the medical services provided by healthcare professionals. All medical services are provided by independent healthcare professionals.</p><h3>User Responsibilities</h3><ol><li><p><strong>Account Creation:</strong> To use certain features of the App, you may need to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p></li><li><p><strong>Confidentiality:</strong> You are responsible for maintaining the confidentiality of your account information and password. You agree to notify us immediately of any unauthorized use of your account.</p></li><li><p><strong>Use of Services:</strong> You agree to use the App only for lawful purposes and in accordance with these Terms. You will not use the App in any way that could damage, disable, overburden, or impair the App or interfere with any other party's use of the App.</p></li></ol><h3>Appointments and Cancellations</h3><ol><li><p><strong>Booking:</strong> By booking an appointment through the App, you agree to provide accurate information. The healthcare provider has the right to accept or decline your appointment request.</p></li><li><p><strong>Cancellations:</strong> If you need to cancel an appointment, you must do so according to the cancellation policy of the healthcare provider. Failure to cancel within the stipulated time may result in a cancellation fee.</p></li></ol><h3>Payments</h3><ol><li><p><strong>Fees:</strong> Any fees for services provided through the App are set by the healthcare providers. The App may facilitate the payment process but is not responsible for the services provided.</p></li><li><p><strong>Payment Information:</strong> You agree to provide valid payment information and authorize the App to charge your payment method for the services provided by the healthcare provider.</p></li></ol>`

export const mockContentPages: ContentPage[] = [
  {
    id: 'cp1',
    type: 'privacy_policy',
    title: 'Privacy Policy',
    content: privacyContent,
    publishedAt: '2025-01-10',
    updatedAt: '2025-01-10',
  },
  {
    id: 'cp2',
    type: 'terms_and_conditions',
    title: 'Terms and Conditions',
    content: termsContent,
    publishedAt: '2025-01-10',
    updatedAt: '2025-01-10',
  },
]
