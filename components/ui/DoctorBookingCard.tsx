"use client"; 

import Image from "next/image";
import Link from "next/link"; 
import { useState, useEffect } from "react";

export interface Doctor {
  id: number;
  name: string;
  title: string;
  description: string;
  location: string;
  avatarUrl: string;
  clinic: {
    name: string;
    address: string;
  };
  price: number;
  specialtyId: number; 
}

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export default function DoctorBookingCard({ doctor }: { doctor: Doctor }) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/doctors/${doctor.id}/schedule?date=${selectedDate}`);
        const data = await res.json();
        
        if (data.timeSlots && Array.isArray(data.timeSlots)) {
          setTimeSlots(data.timeSlots);
        } else {
          setTimeSlots([]);
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [doctor.id, selectedDate]);

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
      dates.push({ value: dateStr, label: dayName });
    }
    return dates;
  };

  const dates = generateDates();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row gap-4">
        
        <div className="w-full md:w-1/2 pr-4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
          <div className="flex gap-3">
            <div className="shrink-0">
              <Image
                src={doctor.avatarUrl} 
                alt={doctor.name}
                width={80}
                height={80}
                className="rounded-full object-cover border"
              />
              <Link href={`/doctors/${doctor.id}`} className="text-sm text-[#92D7EE] hover:underline mt-2 inline-block">
                Xem thêm
              </Link>
            </div>
            <div>
              <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full mb-1">
                Yêu thích
              </span>
              <h2 className="text-base font-semibold text-[#92D7EE]">BS.{doctor.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{doctor.title}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{doctor.description}</p>
              <p className="text-sm text-gray-500 mt-2">📍 {doctor.location}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div>
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm font-semibold border-none focus:ring-0 p-0"
            >
              {dates.map(date => (
                <option key={date.value} value={date.value}>
                  {date.label}
                </option>
              ))}
            </select>
            <p className="text-xs uppercase text-gray-500 mt-1 font-semibold">🗓 LỊCH KHÁM</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
            {loading ? (
              <p className="text-sm text-gray-500">Đang tải...</p>
            ) : timeSlots.length > 0 ? (
              timeSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => slot.isAvailable && setSelectedTime(slot.time)}
                  disabled={!slot.isAvailable}
                  className={`
                    p-2 rounded text-center text-sm font-medium transition
                    ${!slot.isAvailable 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : selectedTime === slot.time 
                      ? 'bg-[#92D7EE] text-gray-900' 
                      : 'bg-gray-100 text-gray-800 hover:bg-[#F7D800] hover:text-black'
                    }
                  `}
                >
                  {slot.time}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">Không có khung giờ trống</p>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Chọn 📅 và đặt (Phí đặt lịch 0đ)
          </p>
            <div className="space-y-2 mt-4">
              <div className="border-t pt-2">
                <p className="text-sm font-semibold uppercase">ĐỊA CHỈ KHÁM</p>
                <p className="text-sm text-gray-700 font-semibold">{doctor.clinic.name}</p>
                <p className="text-sm text-gray-600">{doctor.clinic.address}</p>
              </div>
              
              <div className="border-t pt-2">
                <p className="text-sm text-gray-600">
                  GIÁ KHÁM: 
                  <span className="font-semibold text-gray-800 ml-1">
                    {doctor.price.toLocaleString('vi-VN')}đ
                  </span>
                  <Link href="#" className="text-[#92D7EE] text-sm ml-2 hover:underline">Xem chi tiết</Link>
                </p>
              </div>

              <div className="border-t pt-2">
                <p className="text-sm text-gray-600">
                  LOẠI BẢO HIỂM ÁP DỤNG: 
                  <Link href="#" className="text-[#92D7EE] text-sm ml-2 hover:underline">Xem chi tiết</Link>
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}