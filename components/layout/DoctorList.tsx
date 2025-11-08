'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Star, MapPin, Calendar } from 'lucide-react'

interface Doctor {
  id: number
  user: {
    firstName: string
    lastName: string
  }
  specialty?: {
    name?: string
  }
  clinic: {
    name: string
    address: string
  }
  description: string
  yearsOfExperience: number
  price: number
  image: string
}

export const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch('/api/doctors')
        const data = await response.json()
        if (data.success) {
          setDoctors(data.data)
        } else {
          console.error('Failed to fetch doctors:', data.message)
        }
      } catch (error) {
        console.error('Error fetching doctors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleDoctorClick = (doctorId: number) => {
    router.push(`/doctors/${doctorId}`)
  }

  const handleBookAppointment = (doctorId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/booking?doctorId=${doctorId}`)
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bác sĩ nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đội ngũ bác sĩ chuyên khoa hàng đầu với nhiều năm kinh nghiệm
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {( 
            [...doctors].sort((a, b) => {
              const ay = (a as any).yearsOfExperience ?? (a as any).yearOfExperience ?? 0
              const by = (b as any).yearsOfExperience ?? (b as any).yearOfExperience ?? 0
              return by - ay
            })
          ).map((doctor) => (
            <Card
              key={doctor.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleDoctorClick(doctor.id)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={`BS. ${doctor.user.firstName} ${doctor.user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">
                        {doctor.user.firstName.charAt(0)}{doctor.user.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors">
                    BS. {doctor.user.firstName} {doctor.user.lastName}
                  </h3>
                  <p className="text-sm text-[#92D7EE] font-medium">
                    {doctor.specialty && doctor.specialty.name && doctor.specialty.name !== 'null'
                      ? doctor.specialty.name
                      : 'Chưa cập nhật'}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{doctor.clinic?.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="line-clamp-2">{doctor.yearsOfExperience} năm kinh nghiệm</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-green-600">
                    {doctor.price?.toLocaleString('vi-VN') || 0}đ
                  </span>
                </div>

                <Button
                  className="w-full bg-[#92D7EE] "
                  variant="ghost"
                  onClick={(e) => handleBookAppointment(doctor.id, e)}
                >
                  Đặt lịch khám
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => router.push('/doctors')}
            className="px-8 py-3 "
          >
            Xem tất cả bác sĩ
          </Button>
        </div>
      </div>
    </section>
  )
}