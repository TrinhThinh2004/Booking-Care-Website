import { NextResponse } from 'next/server'
import DB from '../../../../lib/database/models'

// GET
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'ID không hợp lệ' }, { status: 400 })
    }

    const doctor = await DB.Doctor.findByPk(id, {
      include: [
        { model: DB.User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: DB.Specialty, as: 'specialty', attributes: ['id', 'name'] },
        { model: DB.Clinic, as: 'clinic', attributes: ['id', 'name'] },
        { model: DB.Markdown, as: 'markdown' },
      ],
    })

    if (!doctor) return NextResponse.json({ success: false, message: 'Không tìm thấy bác sĩ' }, { status: 404 })

    return NextResponse.json({ success: true, message: 'Lấy thông tin bác sĩ thành công', data: { doctor } })
  } catch (error: any) {
    console.error('Get doctor error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}

// PUT
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: idParam } = params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'ID không hợp lệ' }, { status: 400 })
    }

    const doctor = await DB.Doctor.findByPk(id)
    if (!doctor) return NextResponse.json({ success: false, message: 'Không tìm thấy bác sĩ' }, { status: 404 })

    const body = await req.json()
    const { specialtyId, clinicId, description } = body

    if (specialtyId) {
      const specialty = await DB.Specialty.findByPk(specialtyId)
      if (!specialty) {
        return NextResponse.json(
          { success: false, message: 'Chuyên khoa không tồn tại' },
          { status: 404 }
        )
      }
      doctor.specialtyId = specialtyId
    }

    if (clinicId !== undefined) {
      if (clinicId === null) {
        doctor.clinicId = null
      } else {
        const clinic = await DB.Clinic.findByPk(clinicId)
        if (!clinic) {
          return NextResponse.json(
            { success: false, message: 'Phòng khám không tồn tại' },
            { status: 404 }
          )
        }
        doctor.clinicId = clinicId
      }
    }

    if (description !== undefined) doctor.description = description

    await doctor.save()

    return NextResponse.json({ success: true, message: 'Cập nhật bác sĩ thành công', data: { doctor } })
  } catch (error: any) {
    console.error('Update doctor error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}

// DELETE 
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: idParam } = params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'ID không hợp lệ' }, { status: 400 })
    }

    const doctor = await DB.Doctor.findByPk(id)
    if (!doctor) return NextResponse.json({ success: false, message: 'Không tìm thấy bác sĩ' }, { status: 404 })

    await doctor.destroy()

    return NextResponse.json({ success: true, message: 'Xóa bác sĩ thành công' })
  } catch (error: any) {
    console.error('Delete doctor error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}
