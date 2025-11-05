import { NextResponse } from 'next/server'
import DB from '../../../lib/database/models'

// GET
export async function GET() {
  try {
    const doctors = await DB.Doctor.findAll({
      order: [['createdAt', 'ASC']],
      include: [
        { model: DB.User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: DB.Specialty, as: 'specialty', attributes: ['id', 'name'] },
        { model: DB.Clinic, as: 'clinic', attributes: ['id', 'name'] },
      ],
    })

    return NextResponse.json({ success: true, message: 'Lấy danh sách bác sĩ thành công', data: doctors })
  } catch (error: any) {
    console.error('Get doctors error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}

// POST
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, specialtyId, clinicId, description } = body

    // Validate required fields
    if (!userId || !specialtyId) {
      return NextResponse.json(
        { success: false, message: 'userId và specialtyId là bắt buộc' },
        { status: 400 }
      )
    }

    // Validate foreign keys exist
    const user = await DB.User.findByPk(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    const specialty = await DB.Specialty.findByPk(specialtyId)
    if (!specialty) {
      return NextResponse.json(
        { success: false, message: 'Chuyên khoa không tồn tại' },
        { status: 404 }
      )
    }

    if (clinicId) {
      const clinic = await DB.Clinic.findByPk(clinicId)
      if (!clinic) {
        return NextResponse.json(
          { success: false, message: 'Phòng khám không tồn tại' },
          { status: 404 }
        )
      }
    }

    const doctor = await DB.Doctor.create({
      userId,
      specialtyId,
      clinicId: clinicId || null,
      description: description || null,
    })

    return NextResponse.json({ success: true, message: 'Tạo bác sĩ thành công', data: { doctor } }, { status: 201 })
  } catch (error: any) {
    console.error('Create doctor error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}
