/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import DB from '../../../../lib/database/models'
import sendMail from '@/lib/email/mailer'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, message: 'Thiếu email' }, { status: 400 })
    }

    const user = await DB.User.findOne({ where: { email } })

    // Always return success to avoid revealing which emails exist
    if (!user) {
      return NextResponse.json({ success: true, message: 'Nếu email tồn tại, đã gửi hướng dẫn' })
    }

    const token = (jwt as any).sign({ id: user.id, action: 'reset' }, JWT_SECRET, { expiresIn: '1h' })
    const base = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`
    const resetLink = `${base}/reset?token=${token}`

    const html = `
      <p>Xin chào ${user.firstName || ''},</p>
      <p>Bạn nhận được email này vì chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p><a href="${resetLink}" style="display:inline-block;padding:10px 16px;border-radius:6px;text-decoration:none">Đặt lại mật khẩu</a></p>
      <p>Liên kết sẽ hết hạn trong 1 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `

    await sendMail({ to: user.email, subject: 'Hướng dẫn đặt lại mật khẩu', html })

    return NextResponse.json({ success: true, message: 'Nếu email tồn tại, đã gửi hướng dẫn' })
  } catch (error: any) {
    console.error('Forgot password error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 })
  }
}
