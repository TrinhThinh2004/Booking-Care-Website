/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import DB from '../../../lib/database/models'

// GET - Lấy danh sách tất cả specialties
export async function GET() {
  try {
    const specialties = await DB.Specialty.findAll({
      order: [['createdAt', 'DESC']], // Sắp xếp mới nhất lên đầu (tuỳ bạn muốn giữ hay bỏ)
    })

    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách chuyên khoa thành công',
      data: specialties,
    })
  } catch (error: any) {
    console.error('Get specialties error', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server', error: error?.message || String(error) },
      { status: 500 }
    )
  }
}

// POST - Tạo specialty mới
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, image, isActive } = body

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Tên chuyên khoa là bắt buộc' },
        { status: 400 }
      )
    }

    // Kiểm tra specialty đã tồn tại chưa
    const existing = await DB.Specialty.findOne({ where: { name } })
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Chuyên khoa này đã tồn tại' },
        { status: 409 }
      )
    }

    const specialty = await DB.Specialty.create({
      name,
      description: description || null,
      image: image || null,
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Tạo chuyên khoa thành công',
        data: { specialty },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create specialty error', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server', error: error?.message || String(error) },
      { status: 500 }
    )
  }
}
