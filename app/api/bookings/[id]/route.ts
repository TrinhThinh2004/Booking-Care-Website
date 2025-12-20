import { NextRequest, NextResponse } from 'next/server'
import DB from '@/lib/database/models'
import sendMail from '@/lib/email/mailer'

// GET /api/bookings/:id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const booking = await DB.Booking.findByPk(Number(id), {
      include: [
        { model: DB.User, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: DB.Doctor, as: 'doctor', include: [{ model: DB.User, as: 'user', attributes: ['firstName', 'lastName'] }, { model: DB.Clinic, as: 'clinic', attributes: ['id', 'name'] }] },
        { model: DB.Clinic, as: 'clinic', attributes: ['id', 'name', 'address'] },
      ],
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Không tìm thấy booking' }, { status: 404 })
    return NextResponse.json({ success: true, data: booking })
  } catch (error: any) {
    console.error('Get booking error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}

// PUT /api/bookings/:id  (update status or cancel)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, notes } = body

    const booking = await DB.Booking.findByPk(Number(id))
    if (!booking) return NextResponse.json({ success: false, message: 'Không tìm thấy booking' }, { status: 404 })

    const prevStatus = booking.status
    if (status) booking.status = status
    if (notes !== undefined) booking.notes = notes

    await booking.save()

    // if booking confirmed, notify patient by email
    try {
      if (status === 'CONFIRMED' && prevStatus !== 'CONFIRMED') {
        const patient = await DB.User.findByPk(booking.patientId)
        if (patient && patient.email) {
          const html = `
            <p>Xin chào ${patient.firstName || ''},</p>
            <p>Lịch khám của bạn vào <b>${booking.date} ${booking.timeSlot}</b> đã được bác sĩ xác nhận.</p>
            <p>Mã lịch: <b>${booking.id}</b></p>
          `
          await sendMail({ to: patient.email, subject: 'Lịch khám đã được xác nhận', html })
        }
      }
    } catch (err) {
      console.error('Error sending booking confirmation to patient', err)
    }

    return NextResponse.json({ success: true, message: 'Cập nhật booking thành công', data: booking })
  } catch (error: any) {
    console.error('Update booking error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}

// DELETE /api/bookings/:id  (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const booking = await DB.Booking.findByPk(Number(id))
    if (!booking) return NextResponse.json({ success: false, message: 'Không tìm thấy booking' }, { status: 404 })

    await booking.destroy()
    return NextResponse.json({ success: true, message: 'Xóa booking thành công' })
  } catch (error: any) {
    console.error('Delete booking error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}
