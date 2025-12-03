import { NextRequest, NextResponse } from 'next/server'
import DB from '@/lib/database/models'

// GET /api/bookings?patientId=...&doctorId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const doctorId = searchParams.get('doctorId')

    const where: any = {}
    if (patientId) where.patientId = Number(patientId)
    if (doctorId) where.doctorId = Number(doctorId)

    const bookings = await DB.Booking.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { model: DB.User, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: DB.Doctor, as: 'doctor', include: [{ model: DB.User, as: 'user', attributes: ['firstName', 'lastName'] }, { model: DB.Clinic, as: 'clinic', attributes: ['id', 'name'] }] },
        { model: DB.Clinic, as: 'clinic', attributes: ['id', 'name', 'address'] },
      ],
    })

    return NextResponse.json({ success: true, message: 'Lấy danh sách đặt lịch thành công', data: bookings })
  } catch (error: any) {
    console.error('Get bookings error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}

// POST /api/bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, doctorId, clinicId, date, timeSlot, reason } = body

    if (!patientId || !doctorId || !date || !timeSlot || !reason) {
      return NextResponse.json({ success: false, message: 'Thiếu dữ liệu bắt buộc' }, { status: 400 })
    }

    const patient = await DB.User.findByPk(Number(patientId))
    if (!patient) return NextResponse.json({ success: false, message: 'Bệnh nhân không tồn tại' }, { status: 404 })

    const doctor = await DB.Doctor.findByPk(Number(doctorId))
    if (!doctor) return NextResponse.json({ success: false, message: 'Bác sĩ không tồn tại' }, { status: 404 })

    const clinic = clinicId ? await DB.Clinic.findByPk(Number(clinicId)) : await DB.Clinic.findByPk(doctor.clinicId)
    if (!clinic) return NextResponse.json({ success: false, message: 'Phòng khám không tồn tại' }, { status: 404 })


    const existingBooking = await DB.Booking.findOne({
      where: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        status: ['PENDING', 'CONFIRMED'],
      },
    })
    if (existingBooking) {
      return NextResponse.json({ success: false, message: 'Bạn đã có một lịch khám chưa hoàn thành với bác sĩ này. Vui lòng hủy lịch cũ trước khi đặt lịch mới.' }, { status: 409 })
    }

    const dateStr = new Date(date).toISOString().split('T')[0]

    // Find or create schedule for that doctor/date
    let schedule = await DB.Schedule.findOne({ where: { doctorId: Number(doctorId), date: dateStr } })
    if (!schedule) {
      // create with default open slots (reuse server default in schedule route)
      const defaultSlots = [
        { id: '1', time: '06:00', isAvailable: true },
        { id: '2', time: '08:00', isAvailable: true },
        { id: '3', time: '10:00', isAvailable: true },
        { id: '4', time: '12:00', isAvailable: true },
        { id: '5', time: '14:00', isAvailable: true },
        { id: '6', time: '15:00', isAvailable: true },
        { id: '7', time: '16:00', isAvailable: true },
        { id: '8', time: '17:00', isAvailable: true },
      ]
      schedule = await DB.Schedule.create({ doctorId: Number(doctorId), date: dateStr, timeSlots: defaultSlots })
    }

    // find slot
    const slots = Array.isArray(schedule.timeSlots) ? schedule.timeSlots : JSON.parse(schedule.timeSlots || '[]')
    const slotIndex = slots.findIndex((s: any) => s.id === timeSlot || s.time === timeSlot || (typeof timeSlot === 'string' && s.time && timeSlot.includes(s.time)))
    if (slotIndex === -1) {
      return NextResponse.json({ success: false, message: 'Khung giờ không tồn tại trên lịch bác sĩ' }, { status: 400 })
    }

    if (!slots[slotIndex].isAvailable) {
      return NextResponse.json({ success: false, message: 'Khung giờ đã được đặt' }, { status: 409 })
    }

    // mark slot unavailable and save schedule
    slots[slotIndex].isAvailable = false
    schedule.timeSlots = slots
    await schedule.save()

    // create booking
    const booking = await DB.Booking.create({
      patientId: Number(patientId),
      doctorId: Number(doctorId),
      clinicId: clinic.id,
      scheduleId: schedule.id,
      date: dateStr,
      timeSlot: slots[slotIndex].time || timeSlot,
      reason,
      status: 'PENDING',
    })

    return NextResponse.json({ success: true, message: 'Đặt lịch thành công', data: { booking } }, { status: 201 })
  } catch (error: any) {
    console.error('Create booking error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}
