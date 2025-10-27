'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
interface Specialty {
  id: number
  name: string
  description: string
  image: string
  doctorCount: number
}

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const mockSpecialties: Specialty[] = [
      {
        id: 1,
        name: 'Tim mạch',
        description: 'Chuyên điều trị các bệnh về tim và mạch máu',
        image: 'timmach.png',
        doctorCount: 25
      },
      {
        id: 2,
        name: 'Thần kinh',
        description: 'Chuyên điều trị các bệnh về não và hệ thần kinh',
        image: 'thankinh.png',
        doctorCount: 18
      },
      {
        id: 3,
        name: 'Mắt',
        description: 'Chuyên điều trị các bệnh về mắt và thị lực',
        image: 'mat.png',
        doctorCount: 15
      },
      {
        id: 4,
        name: 'Xương khớp',
        description: 'Chuyên điều trị các bệnh về xương và khớp',
        image: 'coxuongkhop.png',
        doctorCount: 22
      },
      {
        id: 5,
        name: 'Nhi khoa',
        description: 'Chuyên điều trị các bệnh ở trẻ em',
        image: 'nhikhoa.png',
        doctorCount: 20
      },
      {
        id: 6,
        name: 'Hô hấp',
        description: 'Chuyên điều trị các bệnh về phổi và đường hô hấp',
        image: 'hohap.png',
        doctorCount: 16
      },
      {
        id: 7,
        name: 'Tai Mũi Họng',
        description: 'Điều trị các bệnh lý về tai, mũi, họng và đường hô hấp trên',
        image: 'hohap.png',
        doctorCount: 14
      },
      {
        id: 8,
        name: 'Nội tiết',
        description: 'Chẩn đoán và điều trị các rối loạn nội tiết, đái tháo đường',
        image: 'hohap.png',
        doctorCount: 12
      },
      {
        id: 9,
        name: 'Tim mạch can thiệp',
        description: 'Chuyên sâu về can thiệp tim mạch và điều trị đột quỵ',
        image: 'hohap.png',
        doctorCount: 8
      },
      {
        id: 10,
        name: 'Tiêu hóa',
        description: 'Điều trị các bệnh về đường tiêu hóa và gan mật',
        image: 'hohap.png',
        doctorCount: 15
      },
      {
        id: 11,
        name: 'Da liễu',
        description: 'Chăm sóc và điều trị các bệnh về da',
        image: 'hohap.png',
        doctorCount: 10
      },
      {
        id: 12,
        name: 'Xét nghiệm',
        description: 'Thực hiện các xét nghiệm chẩn đoán và theo dõi',
        image: 'hohap.png', 
        doctorCount: 8
      }
    ]

    setTimeout(() => {
      setSpecialties(mockSpecialties)
      setIsLoading(false)
    }, 1000)
  }, [])

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
                      src={`/images/specialty/${specialty.image}`}
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