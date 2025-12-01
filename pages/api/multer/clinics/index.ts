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
    if (req.method === 'POST') {
      await runMiddleware(req, res, upload.single('image'))

      const { name, address, phone, operatingHours, description, isActive } = req.body as any
      if (!name) {
        return res.status(400).json({ success: false, message: 'Tên phòng khám là bắt buộc' })
      }

      // optional duplicate check
      const existing = await DB.Clinic.findOne({ where: { name } })
      if (existing) {
        return res.status(409).json({ success: false, message: 'Phòng khám này đã tồn tại' })
      }

      let imageUrl: string | null = null
      if ((req as any).file) {
        imageUrl = `/uploads/clinics/${(req as any).file.filename}`
      } else if ((req as any).body && (req as any).body.image) {
        imageUrl = (req as any).body.image
      }

      const clinic = await DB.Clinic.create({
        name,
        address: address || null,
        phone: phone || null,
        image: imageUrl,
        operatingHours: operatingHours || null,
        description: description || null,
        isActive: isActive != null ? Boolean(isActive) : true,
      })

      return res.status(201).json({ success: true, message: 'Tạo phòng khám thành công', data: { clinic } })
    }

    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('Multer clinics error', error)
    return res.status(500).json({ success: false, message: 'Lỗi server', error: error?.message || String(error) })
  }
}
