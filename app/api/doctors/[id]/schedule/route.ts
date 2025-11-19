import { NextRequest, NextResponse } from 'next/server';
import DB from '@/lib/database/models';

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

interface ScheduleRequestBody {
  date: string;
  timeSlots: TimeSlot[];
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '06:00', isAvailable: true },
  { id: '2', time: '08:00', isAvailable: true },
  { id: '3', time: '10:00', isAvailable: true },
  { id: '4', time: '12:00', isAvailable: true },
  { id: '5', time: '14:00', isAvailable: true },
  { id: '6', time: '15:00', isAvailable: true },
  { id: '7', time: '16:00', isAvailable: true },
  { id: '8', time: '17:00', isAvailable: true },
];

function toDateString(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().split('T')[0];
}

function parseTimeSlots(raw: any): TimeSlot[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// GET /api/doctors/:id/schedule?date=YYYY-MM-DD
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: doctorId } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const start = searchParams.get('start');
    const daysParam = searchParams.get('days');

    const doctor = await DB.Doctor.findByPk(doctorId);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // If start param is provided, return a range of dates (start + days)
    if (start) {
      const days = Number(daysParam || '6'); // default today + next 5 => 6 days
      const startDate = toDateString(start);
      const dates = Array.from({ length: days }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        return toDateString(d);
      });

      const results = await Promise.all(
        dates.map(async (d) => {
          try {
            const schedule = await DB.Schedule.findOne({
              where: { doctorId: Number(doctorId), date: toDateString(d) },
            });
            if (!schedule) {
              return { id: null, doctorId: Number(doctorId), date: d, timeSlots: DEFAULT_TIME_SLOTS };
            }
            return {
              id: schedule.id,
              doctorId: schedule.doctorId,
              date: schedule.date,
              timeSlots: parseTimeSlots(schedule.timeSlots) || DEFAULT_TIME_SLOTS,
            };
          } catch (e) {
            console.error('DB error in range fetch:', e);
            return { id: null, doctorId: Number(doctorId), date: d, timeSlots: DEFAULT_TIME_SLOTS };
          }
        })
      );

      return NextResponse.json(results);
    }

    // Single-date behavior
    if (!date) {
      return NextResponse.json({ error: 'date query parameter is required' }, { status: 400 });
    }

    const dateStr = toDateString(date);
    let schedule = null;
    try {
      schedule = await DB.Schedule.findOne({
        where: { doctorId: Number(doctorId), date: dateStr },
      });
    } catch (dbError) {
      console.error('Database error finding schedule:', dbError);
      return NextResponse.json({ id: null, doctorId: Number(doctorId), date: dateStr, timeSlots: DEFAULT_TIME_SLOTS });
    }

    if (!schedule) {
      // Return default full-open schedule when no record exists
      return NextResponse.json({ id: null, doctorId: Number(doctorId), date: dateStr, timeSlots: DEFAULT_TIME_SLOTS });
    }

    return NextResponse.json({
      id: schedule.id,
      doctorId: schedule.doctorId,
      date: schedule.date,
      timeSlots: parseTimeSlots(schedule.timeSlots) || DEFAULT_TIME_SLOTS,
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/doctors/:id/schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: doctorId } = await params;
    const body: ScheduleRequestBody = await request.json();

    const { date, timeSlots } = body;

    if (!date || !Array.isArray(timeSlots)) {
      return NextResponse.json(
        { error: 'date and timeSlots (array) are required' },
        { status: 400 }
      );
    }



    const doctor = await DB.Doctor.findByPk(doctorId);
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    const dateStr = toDateString(date);
    const [schedule, created] = await DB.Schedule.findOrCreate({
      where: {
        doctorId: Number(doctorId),
        date: dateStr,
      },
      defaults: {
        doctorId: Number(doctorId),
        date: dateStr,
        timeSlots: timeSlots,
      },
    });

    if (!created) {
      schedule.timeSlots = timeSlots;
      await schedule.save();
    }

    return NextResponse.json({
      id: schedule.id,
      doctorId: schedule.doctorId,
      date: schedule.date,
      timeSlots: schedule.timeSlots,
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}