
import { NextResponse } from 'next/server'
import DB from '../../../../lib/database/models'

// GET - Lấy một specialty theo ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID không hợp lệ' },
        { status: 400 }
      )
    }

    const specialty = await DB.Specialty.findByPk(id)

    if (!specialty) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy chuyên khoa' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lấy thông tin chuyên khoa thành công',
      data: { specialty },
    })
  } catch (error: any) {
    console.error('Get specialty error', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server', error: error?.message || String(error) },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật specialty
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID không hợp lệ' },
        { status: 400 }
      )
    }

    const specialty = await DB.Specialty.findByPk(id)

    if (!specialty) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy chuyên khoa' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const { name, description, image, isActive } = body

    if (name && name !== specialty.name) {
      const existing = await DB.Specialty.findOne({ where: { name } })
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Tên chuyên khoa này đã tồn tại' },
          { status: 409 }
        )
      }
    }

    if (name !== undefined) specialty.name = name
    if (description !== undefined) specialty.description = description
    if (image !== undefined) specialty.image = image
    if (isActive !== undefined) specialty.isActive = isActive

    await specialty.save()

    return NextResponse.json({
      success: true,
      message: 'Cập nhật chuyên khoa thành công',
      data: { specialty },
    })
  } catch (error: any) {
    console.error('Update specialty error', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server', error: error?.message || String(error) },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID không hợp lệ' },
        { status: 400 }
      )
    }

    const specialty = await DB.Specialty.findByPk(id)

    if (!specialty) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy chuyên khoa' },
        { status: 404 }
      )
    }

    const doctorsCount = await DB.Doctor.count({
      where: { specialtyId: id },
    })

    if (doctorsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Không thể xóa chuyên khoa này vì có ${doctorsCount} bác sĩ đang sử dụng`,
        },
        { status: 409 }
      )
    }
    await specialty.destroy()

    return NextResponse.json({
      success: true,
      message: 'Xóa chuyên khoa thành công',
    })
  } catch (error: any) {
    console.error('Delete specialty error', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi server', error: error?.message || String(error) },
      { status: 500 }
    )
  }
}
