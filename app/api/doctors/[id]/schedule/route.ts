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

// GET /api/doctors/:id/schedule?date=YYYY-MM-DD
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: doctorId } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'date query parameter is required' },
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

    let schedule = null;
    try {
      schedule = await DB.Schedule.findOne({
        where: {
          doctorId: Number(doctorId),
          date: date,
        },
      });
    } catch (dbError) {
      console.error('Database error finding schedule:', dbError);
      return NextResponse.json({
        id: null,
        doctorId: Number(doctorId),
        date: date,
        timeSlots: [], 
      });
    }

    if (!schedule) {
      return NextResponse.json({
        id: null,
        doctorId: Number(doctorId),
        date: date,
        timeSlots: [], 
      });
    }

    return NextResponse.json({
      id: schedule.id,
      doctorId: schedule.doctorId,
      date: schedule.date,
      timeSlots: schedule.timeSlots,
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
    const [schedule, created] = await DB.Schedule.findOrCreate({
      where: {
        doctorId: Number(doctorId),
        date: date,
      },
      defaults: {
        doctorId: Number(doctorId),
        date: date,
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
