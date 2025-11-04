
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import DB from '../../../../lib/database/models'

// GET - Lấy một specialty theo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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
  { params }: { params: { id: string } }
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
    const contentType = req.headers.get('content-type') || ''
    let name: string | undefined
    let description: string | undefined
    let isActive: boolean | undefined
    let imageUrl: string | undefined

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      name = (formData.get('name') as string) || undefined
      const desc = (formData.get('description') as string) || ''
      description = desc.trim() ? desc.trim() : undefined
      const isActiveStr = formData.get('isActive') as string | null
      isActive = isActiveStr != null ? isActiveStr === 'true' : undefined

      const file = formData.get('image') as File | null
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'specialties')
        await fs.mkdir(uploadsDir, { recursive: true })
        const ext = path.extname(file.name) || '.png'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
        const filePath = path.join(uploadsDir, fileName)
        await fs.writeFile(filePath, buffer)
        imageUrl = `/uploads/specialties/${fileName}`
      }
    } else {
      const body = await req.json()
      name = body.name
      description = (body.description || '').trim() || undefined
      isActive = body.isActive
      imageUrl = body.image
    }

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
    if (imageUrl !== undefined) specialty.image = imageUrl
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
