'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MapPin, Phone, Star, Clock } from 'lucide-react'

interface Clinic {
  id: number
  name: string
  address: string
  phone: string
  rating: number
  reviewCount: number
  image: string
  specialties: string[]
  openHours: string
}

export const ClinicSection = () => {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const mockClinics: Clinic[] = [
      {
        id: 1,
        name: 'Phòng khám Đa khoa Quốc tế',
        address: '123 Đường Láng, Đống Đa, Hà Nội',
        phone: '024 1234 5678',
        rating: 4.8,
        reviewCount: 234,
        image: 'anviet.png',
        specialties: ['Tim mạch', 'Nhi khoa', 'Xương khớp'],
        openHours: '7:00 - 20:00'
      },
      {
        id: 2,
        name: 'Bệnh viện Đa khoa Hồng Ngọc',
        address: '55 Yên Ninh, Ba Đình, Hà Nội',
        phone: '024 3927 5568',
        rating: 4.7,
        reviewCount: 189,
        image: 'anduc.png',
        specialties: ['Sản phụ khoa', 'Nhi khoa', 'Tim mạch'],
        openHours: '24/7'
      },
      {
        id: 3,
        name: 'Phòng khám Chuyên khoa Mắt',
        address: '456 Kim Mã, Ba Đình, Hà Nội',
        phone: '024 3843 8888',
        rating: 4.9,
        reviewCount: 156,
        image: 'anviet.png',
        specialties: ['Mắt', 'Thần kinh'],
        openHours: '8:00 - 18:00'
      },
      {
        id: 4,
        name: 'Bệnh viện Nhi Trung ương',
        address: '18/879 La Thành, Đống Đa, Hà Nội',
        phone: '024 6273 8532',
        rating: 4.8,
        reviewCount: 312,
        image: 'anviet.png',
        specialties: ['Nhi khoa', 'Sản phụ khoa'],
        openHours: '24/7'
      },
       {
        id: 5,
        name: 'Bệnh viện Nhi Trung ương',
        address: '18/879 La Thành, Đống Đa, Hà Nội',
        phone: '024 6273 8532',
        rating: 4.8,
        reviewCount: 312,
        image: 'anviet.png',
        specialties: ['Nhi khoa', 'Sản phụ khoa'],
        openHours: '24/7'
      },
       {
        id: 6,
        name: 'Bệnh viện Nhi Trung ương',
        address: '18/879 La Thành, Đống Đa, Hà Nội',
        phone: '024 6273 8532',
        rating: 4.8,
        reviewCount: 312,
        image: 'anviet.png',
        specialties: ['Nhi khoa', 'Sản phụ khoa'],
        openHours: '24/7'
      }
    ]

    setTimeout(() => {
      setClinics(mockClinics)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleClinicClick = (clinicId: number) => {
    router.push(`/clinics/${clinicId}`)
  }


  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Phòng khám & Bệnh viện
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hệ thống phòng khám và bệnh viện uy tín với trang thiết bị hiện đại
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <Card
              key={clinic.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden flex flex-col"
              onClick={() => handleClinicClick(clinic.id)}
            >
           
              <div className="h-40 w-full bg-white p-4 border-b"> 
                {clinic.image ? (
                  <img
                    src={`/images/clinic/${clinic.image}`}
                    alt={clinic.name}
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <div className="h-full bg-linear-to-rrom-[#92D7EE] to-[#4B6CB7] flex items-center justify-center rounded-lg">
                    <span className="text-2xl font-bold text-white">
                      {clinic.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
  
              <CardContent className="p-6 flex flex-col grow"> 
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2">
                  {clinic.name}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{clinic.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{clinic.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{clinic.openHours}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                    <span>{clinic.rating} ({clinic.reviewCount} đánh giá)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-mb-2">Chuyên khoa:</p>
                  <div className="flex flex-wrap gap-1">
                    {clinic.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#EFEFEF] text-xs text-black rounded-full font-medium" 
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full transition-colors mt-auto bg-[#92D7EE] " 
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => router.push('/clinics')}
            className="px-8 py-3"
          >
            Xem tất cả phòng khám
          </Button>
        </div>
      </div>
    </section>
  )
}