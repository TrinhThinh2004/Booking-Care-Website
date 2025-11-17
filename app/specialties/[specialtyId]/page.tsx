

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import DoctorBookingCard from '@/components/ui/DoctorBookingCard';

import { Doctor } from '@/components/ui/DoctorBookingCard';
import DB from '@/lib/database/models';

async function getDoctorsBySpecialtyFromDb(specialtyId: number): Promise<Doctor[]> {
  const doctors = await DB.Doctor.findAll({
    where: { specialtyId },
    order: [['createdAt', 'ASC']],
    include: [
      { model: DB.User, as: 'user', attributes: ['firstName', 'lastName', 'email',] },
      { model: DB.Specialty, as: 'specialty', attributes: ['id', 'name'] },
      { model: DB.Clinic, as: 'clinic', attributes: ['id', 'name', 'address'] },
    ],
  });

  const mapped: Doctor[] = doctors.map((d: any) => ({
    id: d.id,
    specialtyId: d.specialtyId || (d.specialty?.id ?? 0),
    name: `${(d.user?.firstName || '')} ${(d.user?.lastName || '')}`.trim() || `Bác sĩ ${d.id}`,
    title: d.introduction || d.title || '',
    description: d.description || (d.markdown?.content ?? '') || '',
    location: d.clinic?.address || '',
    avatarUrl: d.image || d.user?.image || '/images/doctor/default.png',
    clinic: {
      name: d.clinic?.name || 'Chưa cập nhật',
      address: d.clinic?.address || '',
    },
    price: d.price || 0,
  }))

  return mapped
}



export default async function SpecialtyDoctorsPage({ params }: { params: Promise<{ specialtyId: string }> }) {
  
  const { specialtyId: specialtyIdStr } = await params;
  const specialtyId = Number(specialtyIdStr);
  const doctors = Number.isNaN(specialtyId) ? [] : await getDoctorsBySpecialtyFromDb(specialtyId);

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
  
              doctors.map((doc: Doctor) => (
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