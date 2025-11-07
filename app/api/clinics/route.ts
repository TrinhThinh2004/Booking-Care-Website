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
        'operatingHours'
      ]
    })

    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách phòng khám thành công',
      data: { clinics }
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