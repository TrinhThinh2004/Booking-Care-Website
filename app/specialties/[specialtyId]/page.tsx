

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import DoctorBookingCard from '@/components/ui/DoctorBookingCard';

import { Doctor } from "@/components/ui/DoctorBookingCard";

const ALL_DOCTORS_DETAILED: Doctor[] = [
  {
    id: 1,
    specialtyId: 4,
    name: "PGS. TS. BSCKII. TTUT Vũ Văn Hòe",
    title: "Phó chủ tịch Hội Phẫu thuật Cột sống Việt Nam",
    description: "Bác sĩ có 35 năm kinh nghiệm về vực Cột sống, thần kinh, cơ xương khớp.",
    location: "Hà Nội",
    avatarUrl: "/images/doctor/ts-pham-chi-lang.png",
    clinic: {
      name: "Phòng khám Spinetech Clinic",
      address: "Tòa nhà GP, 257 Giải Phóng, phường Bạch Mai, Hà Nội"
    },
    price: 500000
  },
  {
    id: 2,
    specialtyId: 4,
    name: "ThS.BS Nguyễn Trần Trung",
    title: "Phó trưởng khoa Cơ Xương Khớp Bệnh viện E",
    description: "Bác sĩ có nhiều năm kinh nghiệm trong khám và điều trị Cơ xương khớp.",
    location: "Hà Nội",
   avatarUrl: "/images/doctor/ts-pham-chi-lang.png",
    clinic: {
      name: "Phòng Khám Đa Khoa MSC Clinic Hà Nội",
      address: "TT20 - 21 - 22, Số 204 Nguyễn Tuân, Phường Thanh Xuân, TP Hà Nội"
    },
    price: 500000
  },
  {
    id: 3,
    specialtyId: 4, 
    name: "PGS.TS. Phạm Chí Lăng",
    title: "Chuyên gia Tim Mạch hàng đầu",
    description: "Chuyên điều trị các bệnh về tim và mạch máu.",
    location: "TP. HCM",
    avatarUrl: "/images/doctor/ts-pham-chi-lang.png",
    clinic: {
      name: "Bệnh viện A",
      address: "123 Đường ABC, Quận 1, TP. HCM"
    },
    price: 500000
  }
];


async function getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {

  const idToFilter = Number(specialtyId);
  const filtered = ALL_DOCTORS_DETAILED.filter(d => d.specialtyId === idToFilter);
  return filtered;
}



export default async function SpecialtyDoctorsPage({ params }: { params: { specialtyId: string } }) {
  
  const specialtyId = params.specialtyId;
  const doctors = await getDoctorsBySpecialty(specialtyId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Bác sĩ theo Chuyên khoa
          </h1>

          <div className="space-y-4">
            {doctors.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Chưa có bác sĩ cho chuyên khoa này
              </div>
            ) : (
              // Lặp qua danh sách bác sĩ và render thẻ chi tiết
              doctors.map(doc => (
                <DoctorBookingCard key={doc.id} doctor={doc} />
              ))
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}