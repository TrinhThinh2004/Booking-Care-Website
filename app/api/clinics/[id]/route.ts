import { NextResponse } from 'next/server'
import DB from '../../../../lib/database/models'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const clinicId = parseInt(id)

    if (isNaN(clinicId)) {
      return NextResponse.json(
        { success: false, message: 'ID không hợp lệ' },
        { status: 400 }
      )
    }

    const clinic = await DB.Clinic.findOne({
      where: {
        id: clinicId,
        isActive: true
      },
      attributes: [
        'id',
        'name',
        'address',
        'phone',
        'image',
        'operatingHours'
      ],
      include: [{
        model: DB.Doctor,
        as: 'doctors',
        attributes: ['id'],
        include: [{
          model: DB.Specialty,
          as: 'specialty',
          attributes: ['id', 'name']
        }]
      }]
    })

    if (!clinic) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy phòng khám' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lấy thông tin phòng khám thành công',
      data: { clinic }
    })
  } catch (error: any) {
    console.error('Get clinic error:', error)
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

// PUT - update clinic
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const clinicId = parseInt(id)
    if (isNaN(clinicId)) return NextResponse.json({ success: false, message: 'ID không hợp lệ' }, { status: 400 })

    const clinic = await DB.Clinic.findByPk(clinicId)
    if (!clinic) return NextResponse.json({ success: false, message: 'Không tìm thấy phòng khám' }, { status: 404 })

    const body = await req.json()
    const { name, address, phone, image, operatingHours, description, isActive } = body

    if (name !== undefined) clinic.name = name
    if (address !== undefined) clinic.address = address
    if (phone !== undefined) clinic.phone = phone
    if (image !== undefined) clinic.image = image
    if (operatingHours !== undefined) clinic.operatingHours = operatingHours
    if (description !== undefined) clinic.description = description
    if (isActive !== undefined) clinic.isActive = !!isActive

    await clinic.save()

    return NextResponse.json({ success: true, message: 'Cập nhật phòng khám thành công', data: { clinic } })
  } catch (error: any) {
    console.error('Update clinic error:', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}

// DELETE - remove clinic (soft delete by default)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const clinicId = parseInt(id)
    if (isNaN(clinicId)) return NextResponse.json({ success: false, message: 'ID không hợp lệ' }, { status: 400 })

    const clinic = await DB.Clinic.findByPk(clinicId)
    if (!clinic) return NextResponse.json({ success: false, message: 'Không tìm thấy phòng khám' }, { status: 404 })

    // soft delete: set isActive = false
    clinic.isActive = false
    await clinic.save()

    return NextResponse.json({ success: true, message: 'Xóa phòng khám thành công' })
  } catch (error: any) {
    console.error('Delete clinic error:', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}