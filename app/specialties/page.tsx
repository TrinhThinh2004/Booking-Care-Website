"use client"

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useSpecialties } from '@/lib/hooks/useSpecialties'

interface Specialty {
  id: number
  name: string
  description: string
  image?: string
  doctorCount: number
}

export default function SpecialtiesPage() {
  const { data, isLoading } = useSpecialties()

  const specialties: Specialty[] = (data ?? []).map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    image: s.image ? (s.image.startsWith('/') ? s.image : `/images/specialty/${s.image}`) : '/images/specialty/default.png',
    doctorCount: s.doctorCount ?? s?.Doctors?.[0]?.doctorCount ?? 0,
  }))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <LoadingSpinner size="lg" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Chuyên Khoa
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {specialties.map((specialty) => {
              return (
                <div key={specialty.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
                  <div className="h-48 bg-linear-to-r from-[#92D7EE] to-[#4B6CB7] relative">
                    <img
                      src={specialty.image}
                      alt={specialty.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{specialty.name}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{specialty.description}</p>
                     <p className="text-[#92D7EE] text-sm font-medium">
                      {specialty.doctorCount} bác sĩ chuyên khoa
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}