import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import DB from '../../../../lib/database/models'
import sendMail from '../../../../lib/email/mailer'

export const config = {
  api: {
    bodyParser: false,
  },
}

// ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'prescriptions')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.pdf'
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
    const {
      query: { id },
    } = req

    if (req.method === 'POST') {
      await runMiddleware(req, res, upload.single('file'))

      const bookingId = Number(id)
      if (!bookingId) return res.status(400).json({ success: false, message: 'Booking id không hợp lệ' })

      const booking = await DB.Booking.findByPk(bookingId)
      if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy booking' })

      if (booking.status !== 'CONFIRMED') {
        return res.status(400).json({ success: false, message: 'Chỉ có thể tải đơn khi lịch ở trạng thái CONFIRMED' })
      }

      if (!(req as any).file) {
        return res.status(400).json({ success: false, message: 'Vui lòng chọn file để tải lên' })
      }

      const file = (req as any).file
      const relativeUrl = `/uploads/prescriptions/${file.filename}`

      booking.prescription = relativeUrl
      booking.status = 'COMPLETED'
      await booking.save()

      // send email to patient with attachment
      try {
        const patient = await DB.User.findByPk(booking.patientId)
        if (patient && patient.email) {
          const html = `
            <p>Xin chào ${patient.firstName || ''},</p>
            <p>Bác sĩ đã gửi đơn thuốc cho bạn cho lịch khám <b>#${booking.id}</b>.</p>
            <p>Vui lòng xem file đính kèm để biết chi tiết.</p>
          `
          const attachmentPath = path.join(process.cwd(), 'public', 'uploads', 'prescriptions', file.filename)
          await sendMail({
            to: patient.email,
            subject: 'Đơn thuốc từ bác sĩ',
            html,
            attachments: [{ filename: file.originalname || file.filename, path: attachmentPath }],
          })
        }
      } catch (err) {
        console.error('Error sending prescription mail', err)
      }

      return res.status(200).json({ success: true, message: 'Tải lên thành công, đơn thuốc đã được gửi', data: { prescription: booking.prescription } })
    }

    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('Multer bookings error', error)
    return res.status(500).json({ success: false, message: 'Lỗi server', error: error?.message || String(error) })
  }
}
