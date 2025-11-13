
"use client"; 

import Image from "next/image";
import Link from "next/link"; 
import { useState } from "react";


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

const mockTimeSlots = [
  "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00",
  "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "14:00 - 14:30",
  "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00"
];

export default function DoctorBookingCard({ doctor }: { doctor: Doctor }) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
            <select className="text-sm font-semibold border-none focus:ring-0 p-0">
              <option>Thứ 4 - 29/10</option>
              <option>Thứ 5 - 30/10</option>
              <option>Thứ 6 - 31/10</option>
            </select>
            <p className="text-xs uppercase text-gray-500 mt-1 font-semibold">🗓 LỊCH KHÁM</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
            {mockTimeSlots.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`
                  p-2 rounded text-center text-sm font-medium
                  ${selectedTime === time 
                    ? 'bg-[#92D7EE] text-gray-900 ' 
                    : 'bg-gray-100 text-gray-800 hover:bg-[#F7D800] hover:text-black'
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Chọn 📅 và đặt (Phí đặt lịch 0đ)
          </p>
            <div className=" space-y-2 mt-4">
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