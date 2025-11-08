import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import DB from '../../../lib/database/models'
import { Sequelize } from 'sequelize'

// GET 
export async function GET() {
  try {
    const specialties = await DB.Specialty.findAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM doctors AS Doctor
              WHERE Doctor.specialtyId = Specialty.id
            )`),
            'doctorCount',
          ],
        ],
      },
      order: [['createdAt', 'ASC']],
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

// POST 
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''

    let name: string | null = null
    let description: string | null = null
    let isActive: boolean | null = null
    let imageUrl: string | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      name = (formData.get('name') as string) || null
      description = ((formData.get('description') as string) || '').trim() || null
      const isActiveStr = formData.get('isActive') as string | null
      isActive = isActiveStr != null ? isActiveStr === 'true' : true

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
      name = body.name || null
      description = (body.description || '').trim() || null
      isActive = body.isActive != null ? Boolean(body.isActive) : true
      imageUrl = body.image || null
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Tên chuyên khoa là bắt buộc' },
        { status: 400 }
      )
    }

    // Check for existing specialty including soft-deleted rows (paranoid)
    const existing = await DB.Specialty.findOne({ where: { name }, paranoid: false })
    if (existing) {
      // If found but was soft-deleted, restore it instead of creating a new row
      if (existing.deletedAt) {
        existing.deletedAt = null
        existing.name = name
        existing.description = description
        if (imageUrl) existing.image = imageUrl
        existing.isActive = isActive ?? true
        await existing.save()
        await existing.restore?.()
        return NextResponse.json(
          {
            success: true,
            message: 'Chuyên khoa đã được khôi phục',
            data: { specialty: existing },
          },
          { status: 200 }
        )
      }

      // Otherwise it's an active existing specialty
      return NextResponse.json(
        { success: false, message: 'Chuyên khoa này đã tồn tại' },
        { status: 409 }
      )
    }

    const specialty = await DB.Specialty.create({
      name,
      description,
      image: imageUrl,
      isActive: isActive ?? true,
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
