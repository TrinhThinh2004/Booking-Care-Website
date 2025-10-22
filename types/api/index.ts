import { User, Doctor, Specialty, Clinic, Schedule, Booking } from '../database'

// Auth API Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
}

export interface RegisterResponse {
  user: User
  token: string
}

// User API Types
export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  avatar?: string
}

// Doctor API Types
export interface CreateDoctorRequest {
  userId: number
  specialtyId: number
  clinicId: number
  position: string
  introduction?: string
  training?: string
  achievements?: string
  price: number
}

export interface UpdateDoctorRequest {
  specialtyId?: number
  clinicId?: number
  position?: string
  introduction?: string
  training?: string
  achievements?: string
  price?: number
  isActive?: boolean
}

export interface DoctorListResponse {
  doctors: Doctor[]
  total: number
  page: number
  limit: number
}

// Specialty API Types
export interface CreateSpecialtyRequest {
  name: string
  description?: string
  image?: string
}

export interface UpdateSpecialtyRequest {
  name?: string
  description?: string
  image?: string
  isActive?: boolean
}

// Clinic API Types
export interface CreateClinicRequest {
  name: string
  address: string
  phone: string
  email?: string
  description?: string
  image?: string
}

export interface UpdateClinicRequest {
  name?: string
  address?: string
  phone?: string
  email?: string
  description?: string
  image?: string
  isActive?: boolean
}

// Schedule API Types
export interface CreateScheduleRequest {
  doctorId: number
  date: string
  timeSlot: string
  maxBooking: number
}

export interface UpdateScheduleRequest {
  date?: string
  timeSlot?: string
  maxBooking?: number
  isActive?: boolean
}

// Booking API Types
export interface CreateBookingRequest {
  doctorId: number
  clinicId: number
  scheduleId: number
  date: string
  timeSlot: string
  reason: string
  notes?: string
}

export interface UpdateBookingRequest {
  reason?: string
  notes?: string
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
}

export interface BookingListResponse {
  bookings: Booking[]
  total: number
  page: number
  limit: number
}

// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface FilterParams extends PaginationParams {
  specialtyId?: number
  clinicId?: number
  doctorId?: number
  status?: string
  dateFrom?: string
  dateTo?: string
}
