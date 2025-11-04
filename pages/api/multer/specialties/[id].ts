import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import DB from '../../../../lib/database/models'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'specialties')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.png'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, fileName)
  },
})

const upload = multer({ storage })

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (err: any) => {
      if (err) return reject(err)
      resolve(undefined)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = parseInt((req.query.id as string) || '')
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' })
    }

    if (req.method === 'PUT') {
      await runMiddleware(req, res, upload.single('image'))

      const { name, description, isActive } = req.body as any
      const specialty = await DB.Specialty.findByPk(id)
      if (!specialty) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy chuyên khoa' })
      }

      if (name && name !== specialty.name) {
        const existing = await DB.Specialty.findOne({ where: { name } })
        if (existing) {
          return res.status(409).json({ success: false, message: 'Tên chuyên khoa này đã tồn tại' })
        }
      }

      if ((req as any).file) {
        // delete old file if existed and located in uploads
        if (specialty.image && typeof specialty.image === 'string' && specialty.image.startsWith('/uploads/specialties/')) {
          const oldPath = path.join(process.cwd(), 'public', specialty.image)
          try {
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
          } catch (e) {
            console.warn('Failed to remove old specialty image', e)
          }
        }
        specialty.image = `/uploads/specialties/${(req as any).file.filename}`
      }

      if (name !== undefined) specialty.name = name
      if (description !== undefined) specialty.description = description
      if (isActive !== undefined) specialty.isActive = isActive === 'true' || isActive === true

      await specialty.save()

      return res.status(200).json({ success: true, message: 'Cập nhật chuyên khoa thành công', data: { specialty } })
    }

    if (req.method === 'DELETE') {
      const specialty = await DB.Specialty.findByPk(id)
      if (!specialty) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy chuyên khoa' })
      }

      // optionally remove image file
      if (specialty.image && typeof specialty.image === 'string' && specialty.image.startsWith('/uploads/specialties/')) {
        const oldPath = path.join(process.cwd(), 'public', specialty.image)
        try {
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        } catch (e) {
          console.warn('Failed to remove specialty image', e)
        }
      }

      await specialty.destroy()
      return res.status(200).json({ success: true, message: 'Xóa chuyên khoa thành công' })
    }

    res.setHeader('Allow', ['PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('Multer specialties id error', error)
    return res.status(500).json({ success: false, message: 'Lỗi server', error: error?.message || String(error) })
  }
}

