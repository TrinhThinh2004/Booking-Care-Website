'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Star, MapPin, Calendar } from 'lucide-react'

interface Doctor {
  id: number
  firstName: string
  lastName: string
  specialty: string
  hospital: string
  rating: number
  reviewCount: number
  avatar: string
  experience: number
  price: number
}

export const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const mockDoctors: Doctor[] = [
      {
        id: 1,
        firstName: 'Nguyễn Văn',
        lastName: 'An',
        specialty: 'Tim mạch',
        hospital: 'Bệnh viện Bạch Mai',
        rating: 4.8,
        reviewCount: 156,
        avatar: 'ts-pham-chi-lang.png',
        experience: 15,
        price: 500000
      },
      {
        id: 2,
        firstName: 'Trần Thị',
        lastName: 'Bình',
        specialty: 'Nhi khoa',
        hospital: 'Bệnh viện Nhi Trung ương',
        rating: 4.9,
        reviewCount: 203,
        avatar: 'ts-pham-chi-lang.png',
        experience: 12,
        price: 450000
      },
      {
        id: 3,
        firstName: 'Lê Minh',
        lastName: 'Cường',
        specialty: 'Xương khớp',
        hospital: 'Bệnh viện Chấn thương chỉnh hình',
        rating: 4.7,
        reviewCount: 98,
       avatar: 'ts-pham-chi-lang.png',
        experience: 18,
        price: 600000
      },
      {
        id: 4,
        firstName: 'Phạm Thị',
        lastName: 'Dung',
        specialty: 'Mắt',
        hospital: 'Bệnh viện Mắt Trung ương',
        rating: 4.9,
        reviewCount: 134,
        avatar: 'ts-pham-chi-lang.png',
        experience: 10,
        price: 400000
      }
    ]

    setTimeout(() => {
      setDoctors(mockDoctors)
      setIsLoading(false)
    }, 1000)
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
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleDoctorClick(doctor.id)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {doctor.avatar ? (
                      <img
                        src={`/images/doctor/${doctor.avatar}`}
                        alt={`BS. ${doctor.firstName} ${doctor.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">
                        {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900  transition-colors">
                    BS. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-sm text-[#92D7EE]  font-medium">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{doctor.experience} năm kinh nghiệm</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                    <span>{doctor.rating} ({doctor.reviewCount} đánh giá)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-green-600">
                    {doctor.price.toLocaleString('vi-VN')}đ
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
