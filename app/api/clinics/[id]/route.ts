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