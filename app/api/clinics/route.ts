import { NextResponse } from 'next/server'
import DB from '../../../lib/database/models'

// GET
export async function GET() {
  try {
    const clinics = await DB.Clinic.findAll({
      where: {
        isActive: true
      },
      attributes: [
        'id', 
        'name', 
        'address', 
        'phone',
        'image',
        'operatingHours',
        'description'
      ],
      include: [
        {
          model: DB.Doctor,
          as: 'doctors',
          attributes: ['id', 'specialtyId'],
          include: [
            {
              model: DB.Specialty,
              as: 'specialty',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })

    const mappedClinics = clinics.map((clinic: any) => {
      const uniqueSpecialties = Array.from(
        new Map(
          (clinic.doctors || [])
            .filter((d: any) => d.specialty)
            .map((d: any) => [d.specialty.id, d.specialty.name])
        ).entries()
      ).map(([id, name]: [any, any]) => ({ id, name }))

      return {
        id: clinic.id,
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        image: clinic.image,
        operatingHours: clinic.operatingHours || '24/7',
        description: clinic.description,
        specialties: uniqueSpecialties.map(s => s.name),
        rating: 4.8, // Mock rating
        reviewCount: 200 // Mock review count
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách phòng khám thành công',
      data: { clinics: mappedClinics }
    })
  } catch (error: any) {
    console.error('Get clinics error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi server', 
        error: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}