'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Shield, Users, Award, Heart } from 'lucide-react'

export const AboutSection = () => {
  const router = useRouter()

  const features = [
    {
      icon: Shield,
      title: 'Bảo mật thông tin',
      description: 'Thông tin cá nhân và y tế được bảo mật tuyệt đối theo tiêu chuẩn quốc tế'
    },
    {
      icon: Users,
      title: 'Đội ngũ chuyên gia',
      description: 'Hơn 1000 bác sĩ chuyên khoa giàu kinh nghiệm từ các bệnh viện hàng đầu'
    },
    {
      icon: Award,
      title: 'Chất lượng dịch vụ',
      description: 'Cam kết mang đến dịch vụ y tế chất lượng cao với chi phí hợp lý'
    },
    {
      icon: Heart,
      title: 'Chăm sóc tận tâm',
      description: 'Luôn đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Bệnh nhân tin tưởng' },
    { number: '1000+', label: 'Bác sĩ chuyên khoa' },
    { number: '100+', label: 'Phòng khám đối tác' },
    { number: '99%', label: 'Hài lòng dịch vụ' }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Về Booking Care
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Booking Care là nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam, 
              kết nối bệnh nhân với đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm từ các 
              bệnh viện và phòng khám uy tín.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Với sứ mệnh mang đến dịch vụ y tế chất lượng cao, tiện lợi và đáng tin cậy, 
              chúng tôi cam kết đồng hành cùng bạn trong hành trình chăm sóc sức khỏe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 ">
              {/* Use variant="ghost" so Button doesn't force a default bg and custom bg utility wins */}
              <Button
                 variant="ghost"
                 className="bg-[#92D7EE] "
                 onClick={() => router.push('/about')}>
                Tìm hiểu thêm
              </Button>
              <Button variant="outline" onClick={() => router.push('/contact')}>
                Liên hệ với chúng tôi
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-linear-to-br from-[#92D7EE] to-[#4B6CB7] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Tại sao chọn Booking Care?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Đặt lịch khám nhanh chóng, tiện lợi 24/7
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Đội ngũ bác sĩ chuyên khoa hàng đầu
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Hệ thống phòng khám đối tác uy tín
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Bảo mật thông tin tuyệt đối
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Hỗ trợ khách hàng 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[#92D7EE]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="bg-[#EFEFEF] rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thành tựu của chúng tôi
            </h3>
            <p className="text-gray-600">
              Những con số ấn tượng phản ánh sự tin tưởng của cộng đồng
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#92D7EE] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
