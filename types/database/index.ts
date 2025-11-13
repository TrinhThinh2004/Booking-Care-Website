export interface User {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  address?: string
  phone?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
  avatar?: string
  isActive: boolean
  doctorId?: number | null
  createdAt: Date
  updatedAt: Date
}

export interface Doctor {
  id: number
  userId: number
  specialtyId: number
  clinicId: number
  position: string
  introduction?: string
  training?: string
  achievements?: string
  price: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Relations
  user?: User
  specialty?: Specialty
  clinic?: Clinic
  schedules?: Schedule[]
  bookings?: Booking[]
}

export interface Specialty {
  id: number
  name: string
  description?: string
  image?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Relations
  doctors?: Doctor[]
}

export interface Clinic {
  id: number
  name: string
  address: string
  phone: string
  email?: string
  description?: string
  image?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Relations
  doctors?: Doctor[]
  bookings?: Booking[]
}

export interface Schedule {
  id: number
  doctorId: number
  date: Date
  timeSlot: string
  maxBooking: number
  currentBooking: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Relations
  doctor?: Doctor
  bookings?: Booking[]
}

export interface Booking {
  id: number
  patientId: number
  doctorId: number
  clinicId: number
  scheduleId: number
  date: Date
  timeSlot: string
  reason: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  createdAt: Date
  updatedAt: Date
  // Relations
  patient?: User
  doctor?: Doctor
  clinic?: Clinic
  schedule?: Schedule
}

export interface AllCode {
  id: number
  type: string
  key: string
  value: string
  createdAt: Date
  updatedAt: Date
}

export interface Markdown {
  id: number
  doctorId: number
  contentHTML: string
  contentMarkdown: string
  description?: string
  createdAt: Date
  updatedAt: Date
  // Relations
  doctor?: Doctor
}

export interface History {
  id: number
  patientId: number
  doctorId: number
  description: string
  files?: string
  createdAt: Date
  updatedAt: Date
  // Relations
  patient?: User
  doctor?: Doctor
}
