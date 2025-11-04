"use client"

import { useRouter } from 'next/navigation'
import { useSpecialties } from '@/lib/hooks/useSpecialties'
import { Card, CardContent } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Specialty {
  id: number
  name: string
  description: string
  image?: string
  doctorCount: number
}

export const Specialty = () => {
  const router = useRouter()
  const { data, isLoading } = useSpecialties()

  const specialties: any[] = (data ?? []).map((s: any) => ({
    ...s,
    doctorCount: s?.Doctors?.[0]?.doctorCount ?? s.doctorCount ?? 0,
  }))

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
          {specialties.slice(0, 6).map((specialty) => {
            return (
              <Card
                key={specialty.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleSpecialtyClick(specialty.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors overflow-hidden">
                      <img
                        src={specialty.image}
                        alt={specialty.name}
                        className="w-full h-full object-cover"
                      />
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