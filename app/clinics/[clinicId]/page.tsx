import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import DB from '@/lib/database/models'
import Link from 'next/link'
import { MapPin, Phone, Clock, Users, ArrowLeft, Stethoscope, Calendar } from 'lucide-react'

interface ClinicDoctor {
    id: number
    name: string
    image: string
    specialtyName: string
    yearsOfExperience: number
}

interface ClinicSpecialty {
    id: number
    name: string
    image?: string
}

async function getClinicDetailFromDb(clinicId: number) {
    const clinic = await DB.Clinic.findOne({
        where: { id: clinicId, isActive: true },
        attributes: ['id', 'name', 'address', 'phone', 'image', 'description', 'operatingHours'],
        include: [
            {
                model: DB.Doctor,
                as: 'doctors',
                attributes: ['id', 'image', 'yearsOfExperience', 'specialtyId'],
                include: [
                    {
                        model: DB.User,
                        as: 'user',
                        attributes: ['firstName', 'lastName'],
                    },
                    {
                        model: DB.Specialty,
                        as: 'specialty',
                        attributes: ['id', 'name', 'image'],
                    },
                ],
            },
        ],
    })

    if (!clinic) return null

    const plain = clinic.toJSON() as any

    const doctors: ClinicDoctor[] = (plain.doctors || []).map((d: any) => ({
        id: d.id,
        name: `${d.user?.firstName || ''} ${d.user?.lastName || ''}`.trim() || `Bác sĩ ${d.id}`,
        image: d.image || '/images/doctor/default.png',
        specialtyName: d.specialty?.name || 'Chưa cập nhật',
        yearsOfExperience: d.yearsOfExperience || 0,
    }))

    const specialtiesMap = new Map<number, { name: string; image?: string }>()
        ; (plain.doctors || []).forEach((d: any) => {
            if (d.specialty) {
                specialtiesMap.set(d.specialty.id, { name: d.specialty.name, image: d.specialty.image })
            }
        })
    const specialties: ClinicSpecialty[] = Array.from(specialtiesMap.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        image: data.image,
    }))

    return {
        id: plain.id,
        name: plain.name,
        address: plain.address,
        phone: plain.phone,
        image: plain.image,
        description: plain.description,
        operatingHours: plain.operatingHours || '24/7',
        doctors,
        specialties,
    }
}

export default async function ClinicDetailPage({
    params,
}: {
    params: Promise<{ clinicId: string }>
}) {
    const { clinicId: clinicIdStr } = await params
    const clinicId = Number(clinicIdStr)

    if (Number.isNaN(clinicId)) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
                        <p className="text-red-500 text-lg">ID phòng khám không hợp lệ</p>
                        <Link href="/clinics" className="text-[#49bce2] hover:underline mt-4 inline-block">
                            ← Quay lại danh sách phòng khám
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const clinic = await getClinicDetailFromDb(clinicId)

    if (!clinic) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
                        <p className="text-gray-500 text-lg">Không tìm thấy phòng khám</p>
                        <Link href="/clinics" className="text-[#49bce2] hover:underline mt-4 inline-block">
                            ← Quay lại danh sách phòng khám
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="bg-white">
                {/* Breadcrumb */}
                <div className="bg-gray-50 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center text-sm text-gray-500 flex-wrap gap-1">
                            <Link href="/" className="hover:text-[#49bce2] transition-colors">Trang chủ</Link>
                            <span className="mx-1">/</span>
                            <Link href="/clinics" className="hover:text-[#49bce2] transition-colors">Phòng khám</Link>
                            <span className="mx-1">/</span>
                            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{clinic.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#e8f7fc] to-[#f0f4ff]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <Link
                            href="/clinics"
                            className="inline-flex items-center text-sm text-[#49bce2] hover:text-[#3a9ec0] mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Quay lại danh sách
                        </Link>

                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start">
                            {/* Clinic Image */}
                            <div className="w-full sm:w-80 lg:w-96 h-48 sm:h-56 bg-white rounded-xl shadow-md overflow-hidden border flex-shrink-0 p-4">
                                {clinic.image ? (
                                    <img
                                        src={clinic.image}
                                        alt={clinic.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-[#92D7EE] to-[#4B6CB7] flex items-center justify-center rounded-lg">
                                        <span className="text-5xl font-bold text-white">
                                            {clinic.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Clinic Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    {clinic.name}
                                </h1>

                                <div className="space-y-3 text-gray-600">
                                    <div className="flex items-start justify-center lg:justify-start">
                                        <MapPin className="w-5 h-5 mr-2 mt-0.5 shrink-0 text-[#49bce2]" />
                                        <span className="text-sm sm:text-base">{clinic.address}</span>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <Phone className="w-5 h-5 mr-2 shrink-0 text-[#49bce2]" />
                                        <a href={`tel:${clinic.phone}`} className="text-sm sm:text-base hover:text-[#49bce2] transition-colors">
                                            {clinic.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <Clock className="w-5 h-5 mr-2 shrink-0 text-[#49bce2]" />
                                        <span className="text-sm sm:text-base">{clinic.operatingHours}</span>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <Users className="w-5 h-5 mr-2 shrink-0 text-[#49bce2]" />
                                        <span className="text-sm sm:text-base">{clinic.doctors.length} bác sĩ</span>
                                    </div>
                                </div>

                                {/* Specialties tags */}
                                {clinic.specialties.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                                        {clinic.specialties.map((s) => (
                                            <Link
                                                key={s.id}
                                                href={`/specialties/${s.id}`}
                                                className="px-3 py-1.5 bg-white border border-[#92D7EE] text-[#49bce2] text-sm rounded-full font-medium hover:bg-[#92D7EE] hover:text-white transition-colors"
                                            >
                                                {s.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {clinic.description && (
                    <section className="border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                <Stethoscope className="w-6 h-6 mr-2 text-[#49bce2]" />
                                Giới thiệu
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed text-sm sm:text-base">
                                {clinic.description.split('\n').map((paragraph: string, i: number) => (
                                    <p key={i} className="mb-3">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Doctors Section */}
                <section className="border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Users className="w-6 h-6 mr-2 text-[#49bce2]" />
                            Đội ngũ bác sĩ ({clinic.doctors.length})
                        </h2>

                        {clinic.doctors.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                Chưa có thông tin bác sĩ
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {clinic.doctors.map((doctor) => (
                                    <div
                                        key={doctor.id}
                                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                                    >
                                        <div className="p-4 sm:p-5">
                                            <div className="flex items-center mb-3">
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100 shrink-0 border-2 border-[#92D7EE]">
                                                    <img
                                                        src={doctor.image}
                                                        alt={doctor.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                                        BS. {doctor.name}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-[#49bce2] font-medium">
                                                        {doctor.specialtyName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                                                <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                                <span>{doctor.yearsOfExperience} năm kinh nghiệm</span>
                                            </div>

                                            <Link
                                                href={`/doctors/${doctor.id}/booking`}
                                                className="block w-full text-center py-2 px-4 bg-[#92D7EE] hover:bg-[#7ac8e2] text-gray-900 font-medium rounded-lg transition-colors text-xs sm:text-sm"
                                            >
                                                Đặt lịch khám
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Specialties Section */}
                {clinic.specialties.length > 0 && (
                    <section>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Stethoscope className="w-6 h-6 mr-2 text-[#49bce2]" />
                                Chuyên khoa tại phòng khám
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {clinic.specialties.map((specialty) => (
                                    <Link
                                        key={specialty.id}
                                        href={`/specialties/${specialty.id}`}
                                        className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-[#92D7EE] hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#e8f7fc] flex items-center justify-center mr-3 shrink-0 overflow-hidden group-hover:bg-[#92D7EE] transition-colors">
                                            {specialty.image ? (
                                                <img
                                                    src={specialty.image}
                                                    alt={specialty.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Stethoscope className="w-5 h-5 text-[#49bce2] group-hover:text-white transition-colors" />
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm sm:text-base group-hover:text-[#49bce2] transition-colors">
                                            {specialty.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    )
}
