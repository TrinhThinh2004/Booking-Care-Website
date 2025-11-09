import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import multer from 'multer'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'doctors')
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

      if (!(req as any).file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' })
      }

      const filename = (req as any).file.filename as string
      const imagePath = `/uploads/doctors/${filename}`

      return res.status(200).json({ success: true, imagePath })
    }

    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('Doctor image upload error', error)
    return res.status(500).json({ success: false, message: 'Lỗi server', error: error?.message || String(error) })
  }
}
