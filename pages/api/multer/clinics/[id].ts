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

const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'clinics')
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

      const { name, address, phone, operatingHours, description, isActive } = req.body as any
      const clinic = await DB.Clinic.findByPk(id)
      if (!clinic) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phòng khám' })
      }

      if ((req as any).file) {
        // delete old file if existed and located in uploads
        if (clinic.image && typeof clinic.image === 'string' && clinic.image.startsWith('/uploads/clinics/')) {
          const oldPath = path.join(process.cwd(), 'public', clinic.image)
          try {
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
          } catch (e) {
            console.warn('Failed to remove old clinic image', e)
          }
        }
        clinic.image = `/uploads/clinics/${(req as any).file.filename}`
      } else if ((req as any).body && (req as any).body.image) {
        clinic.image = (req as any).body.image
      }

      if (name !== undefined) clinic.name = name
      if (address !== undefined) clinic.address = address
      if (phone !== undefined) clinic.phone = phone
      if (operatingHours !== undefined) clinic.operatingHours = operatingHours
      if (description !== undefined) clinic.description = description
      if (isActive !== undefined) clinic.isActive = isActive === 'true' || isActive === true

      await clinic.save()

      return res.status(200).json({ success: true, message: 'Cập nhật phòng khám thành công', data: { clinic } })
    }

    if (req.method === 'DELETE') {
      const clinic = await DB.Clinic.findByPk(id)
      if (!clinic) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phòng khám' })
      }

      if (clinic.image && typeof clinic.image === 'string' && clinic.image.startsWith('/uploads/clinics/')) {
        const oldPath = path.join(process.cwd(), 'public', clinic.image)
        try {
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        } catch (e) {
          console.warn('Failed to remove clinic image', e)
        }
      }

      await clinic.destroy()
      return res.status(200).json({ success: true, message: 'Xóa phòng khám thành công' })
    }

    res.setHeader('Allow', ['PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('Multer clinics id error', error)
    return res.status(500).json({ success: false, message: 'Lỗi server', error: error?.message || String(error) })
  }
}
