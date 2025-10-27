"use client"

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Star, MapPin, Phone } from 'lucide-react'

interface Doctor {
  id: number
  name: string
  specialty: string
  clinic: string
  rating: number
  image: string
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const mockDoctors: Doctor[] = [
      { id: 1, name: 'PGS.TS. Phạm Chí Lăng', specialty: 'Tim mạch', clinic: 'Bệnh viện A', rating: 4.8, image: 'ts-pham-chi-lang.png' },
      { id: 2, name: 'TS.BS. Nguyễn Văn An', specialty: 'Thần kinh', clinic: 'Bệnh viện B', rating: 4.6, image: 'ts-pham-chi-lang.png'  },
      { id: 3, name: 'BS.CKII. Trần Thị Hoa', specialty: 'Mắt', clinic: 'Phòng khám C', rating: 4.7,image: 'ts-pham-chi-lang.png' },
      { id: 4, name: 'BS. Lê Minh', specialty: 'Xương khớp', clinic: 'Bệnh viện D', rating: 4.5,image: 'ts-pham-chi-lang.png'  },
      { id: 5, name: 'BS. Hà Thu', specialty: 'Nhi khoa', clinic: 'Bệnh viện E', rating: 4.9, image: 'ts-pham-chi-lang.png'  },
      { id: 6, name: 'TS.BS. Vương Nam', specialty: 'Hô hấp', clinic: 'Phòng khám F', rating: 4.4, image: 'ts-pham-chi-lang.png' },
      { id: 7, name: 'BS. Trịnh Mai', specialty: 'Tai Mũi Họng', clinic: 'Bệnh viện G', rating: 4.3,image: 'ts-pham-chi-lang.png'  },
      { id: 8, name: 'TS.BS. Phan Quốc', specialty: 'Nội tiết', clinic: 'Bệnh viện H', rating: 4.2, image: 'ts-pham-chi-lang.png' },
      { id: 9, name: 'BS. Hoàng Dũng', specialty: 'Tim mạch can thiệp', clinic: 'Bệnh viện I', rating: 4.6, image: 'ts-pham-chi-lang.png' },
      { id: 10, name: 'BS. Nguyễn Hoa', specialty: 'Tiêu hóa', clinic: 'Phòng khám J', rating: 4.5, image: 'ts-pham-chi-lang.png' },
      { id: 11, name: 'BS. Lê Anh', specialty: 'Da liễu', clinic: 'Bệnh viện K', rating: 4.5, image: 'ts-pham-chi-lang.png' },
      { id: 12, name: 'BS. Trương Vy', specialty: 'Xét nghiệm', clinic: 'Phòng khám L', rating: 4.0, image: 'ts-pham-chi-lang.png' },
    ]

    setTimeout(() => {
      setDoctors(mockDoctors)
      setIsLoading(false)
    }, 800)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Bác sĩ</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">Đang tải danh sách bác sĩ...</div>
            ) : (
              doctors.map((doc) => (
                <div 
    key={doc.id} 
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col" 
  >
    <div className="flex items-center p-6 grow"> 
    
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
        <img src={`/images/doctor/${doc.image}`} alt={doc.name} className="w-full h-full object-cover" />
      </div>

      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
        <p className="text-sm text-gray-600">{doc.specialty} • {doc.clinic}</p>
        <div className="mt-3 flex items-center text-sm text-gray-700">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="font-medium mr-2">{doc.rating.toFixed(1)}</span>
          <span className="text-gray-400">|</span>
          <MapPin className="w-4 h-4  text-gray-400 ml-3 mr-1" />
          <span className="text-gray-600">{doc.clinic}</span>
        </div>
      </div>
    </div>

    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
      <button className="text-sm text-[#92D7EE] font-medium hover:underline">Xem hồ sơ</button>
      <div className="text-sm text-gray-500 flex items-center">
        <Phone  className="w-4 h-4 mr-2 text-[#92D7EE]" />
        <span>Liên hệ</span>
      </div>
    </div>
  </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
