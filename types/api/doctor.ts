export interface Doctor {
  id: number
  userId: number
  specialtyId: number
  clinicId?: number | null
  description?: string | null
//   position?: string | null
  price?: number
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    image?: string | null
  }
  specialty: {
    id: number
    name: string
  }
  clinic?: {
    id: number
    name: string
    address?: string
  } | null
  markdown?: any
}