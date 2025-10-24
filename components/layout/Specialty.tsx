'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Heart, Brain, Eye, Bone, Baby, Wind } from 'lucide-react'

interface Specialty {
  id: number
  name: string
  description: string
  icon?: string
  image?: string
  doctorCount: number
}

export const Specialty = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const specialtyIcons = {
    Heart,
    Brain,
    Eye,
    Bone,
    Baby,
    Wind
  }

  useEffect(() => {
    const mockSpecialties: Specialty[] = [
      {
        id: 1,
        name: 'Tim mạch',
        description: 'Chuyên điều trị các bệnh về tim và mạch máu',
        icon: 'Heart',
        image: 'timmach.png',
        doctorCount: 25
      },
      {
        id: 2,
        name: 'Thần kinh',
        description: 'Chuyên điều trị các bệnh về não và hệ thần kinh',
        icon: 'Brain',
        image: 'thankinh.png',
        doctorCount: 18
      },
      {
        id: 3,
        name: 'Mắt',
        description: 'Chuyên điều trị các bệnh về mắt và thị lực',
        icon: 'Eye',
        image: 'mat.png',
        doctorCount: 15
      },
      {
        id: 4,
        name: 'Xương khớp',
        description: 'Chuyên điều trị các bệnh về xương và khớp',
        icon: 'Bone',
        image: 'coxuongkhop.png',
        doctorCount: 22
      },
      {
        id: 5,
        name: 'Nhi khoa',
        description: 'Chuyên điều trị các bệnh ở trẻ em',
        icon: 'Baby',
        image: 'nhikhoa.png',
        doctorCount: 20
      },
      {
        id: 6,
        name: 'Hô hấp',
        description: 'Chuyên điều trị các bệnh về phổi và đường hô hấp',
        icon: 'Lungs',
        image: 'hohap.png',
        doctorCount: 16
      }
    ]

    setTimeout(() => {
      setSpecialties(mockSpecialties)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSpecialtyClick = (specialtyId: number) => {
    router.push(`/specialties/${specialtyId}`)
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
            Chuyên khoa nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các chuyên khoa y tế với đội ngũ bác sĩ giàu kinh nghiệm
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => {
            const IconComponent = specialtyIcons[specialty.icon as keyof typeof specialtyIcons] || Heart
            
            return (
              <Card
                key={specialty.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleSpecialtyClick(specialty.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors overflow-hidden">
                      {specialty.image ? (
                        <img
                          src={`/images/specialty/${specialty.image}`}
                          alt={specialty.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IconComponent className="w-6 h-6 text-[#92D7EE]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#92D7EE] transition-colors">
                        {specialty.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {specialty.doctorCount} bác sĩ
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {specialty.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/specialties')}
            className="bg-[#92D7EE] text-gray-900 hover:bg-[#F7D800] hover:text-black px-8 py-3 rounded-lg transition-colors font-medium"
          >
            Xem tất cả chuyên khoa
          </button>
        </div>
      </div>
    </section>
  )
}
