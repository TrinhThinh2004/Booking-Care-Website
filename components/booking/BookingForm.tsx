"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type DoctorMini = {
  id: number;
  name: string;
  title?: string;
  clinic?: { name?: string; address?: string } | null;
  price?: number | null;
  avatarUrl?: string | null;
};

const mockTimeSlots = [
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "11:30 - 12:00",
  "12:00 - 12:30",
  "14:00 - 14:30",
  "14:30 - 15:00",
  "15:00 - 15:30",
  "15:30 - 16:00",
];
const mockProvinces = [
  { value: "Hanoi", label: "Hà Nội" },
  { value: "HCM", label: "TP.HCM" },
  { value: "DaNang", label: "Đà Nẵng" },
];
const mockDistricts = [
  { value: "BaDinh", label: "Ba Đình", province: "Hanoi" },
  { value: "HoanKiem", label: "Hoàn Kiếm", province: "Hanoi" },
  { value: "Q1", label: "Quận 1", province: "HCM" },
  { value: "HaiChau", label: "Hải Châu", province: "DaNang" },
];

export default function BookingForm({ doctorId }: { doctorId: string }) {
  const [doctor, setDoctor] = useState<DoctorMini | null>(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState<string>("2025-11-13");
  const [timeSlot, setTimeSlot] = useState<string | null>("14:00 - 15:00");
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/doctors/${doctorId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load doctor");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const d: DoctorMini = {
          id: data?.id || Number(doctorId),
          name: data?.name || data?.user?.name || `Bác sĩ ${doctorId}`,
          title: data?.title || data?.user?.position || undefined,
          clinic: data?.clinic || (data?.clinicName ? { name: data.clinicName, address: data.clinicAddress } : null),
          price: data?.price ?? data?.clinic?.price ?? 500000,
          avatarUrl: data?.image || data?.avatarUrl || data?.user?.image || null,
        };
        setDoctor(d);
      })
      .catch((err) => {
        console.error(err);
        if (!mounted) return;
        setDoctor({
          id: Number(doctorId),
          name: "PGS. TS. BSCKII. TTƯT Vũ Văn Hòe",
          title: "Bác sĩ Chuyên khoa II",
          clinic: { name: "Phòng khám Spinech Clinic", address: "Tòa nhà GP, 257 Giải Phóng, phường Bạch Mai, Hà Nội" },
          price: 500000,
          avatarUrl: "/path/to/avatar.png"
        });
        setError(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);

    if (!patientName.trim()) return setError("Vui lòng nhập họ tên bệnh nhân.");
    if (!phone.trim()) return setError("Vui lòng nhập số điện thoại.");
    if (!birthYear.trim()) return setError("Vui lòng nhập năm sinh.");
    
  };

  if (loading) return <div>Đang tải thông tin...</div>;
  
  const filteredDistricts = mockDistricts.filter(d => d.province === province);

  return (
    <>
      {/* Full-width doctor header */}
      <div className="w-full bg-gray-50 border-b py-4">
        <div className="max-w-xl mx-auto px-6 flex items-center gap-4">
          {doctor?.avatarUrl ? (
            <Image
              src={doctor.avatarUrl}
              alt={doctor.name}
              width={80}
              height={80}
              className="rounded-full border object-cover"
              onError={(e) => (e.currentTarget.src = "https://default-avatar-url.png")}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">Ảnh BS</div>
          )}

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase text-[#92D7EE]">ĐẶT LỊCH KHÁM</p>
            <h2 className="text-lg font-semibold text-gray-900">{doctor?.name}</h2>
            {doctor?.title && <p className="text-sm text-gray-600">{doctor.title}</p>}

            {date && timeSlot && (
              <p className="text-sm font-semibold text-gray-800 mt-1">
                🗓 {timeSlot} - {new Date(date).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
              </p>
            )}

            <p className="text-sm text-gray-600 mt-1">
              📍 {doctor?.clinic?.name} — {doctor?.clinic?.address}
            </p>
          </div>
        </div>
      </div>

      {/* Centered booking form */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-5 max-w-xl mx-auto mt-6">
        <form onSubmit={handleSubmit} className="space-y-3">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá khám</label>
          <span className="inline-block border border-[#92D7EE]  text-[#92D7EE] font-semibold px-3 py-1 rounded-md text-sm">
            {doctor?.price ? `${doctor.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
          </span>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Đặt cho</label>
          <div className="mt-1 flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input type="radio" name="bookingFor" defaultChecked className="form-radio" /> Đặt cho mình
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="bookingFor" className="form-radio" /> Đặt cho người thân
            </label>
          </div>
        </div>
        
  <div className="space-y-3 pt-2">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Họ tên bệnh nhân (bắt buộc)</label>
            <input 
              id="patientName"
              placeholder="Vd: Trần Văn Phú"
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:border-blue-400" 
            />
            <p className="mt-1 text-xs text-gray-500">Hãy ghi rõ họ và tên, viết hoa những chữ cái đầu tiên.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Giới tính (bắt buộc)</label>
            <div className="mt-1 flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <input type="radio" checked={gender === 'male'} onChange={() => setGender('male')} className="form-radio" /> Nam
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={gender === 'female'} onChange={() => setGender('female')} className="form-radio" /> Nữ
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại (bắt buộc)</label>
            <input 
              id="phone"
              type="tel"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:border-blue-400" 
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Địa chỉ email</label>
            <input 
              id="email"
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:border-blue-400" 
            />
          </div>

          <div>
            <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700">Năm sinh (bắt buộc)</label>
            <input 
              id="birthYear"
              type="number"
              placeholder="Vd: 1990"
              value={birthYear} 
              onChange={(e) => setBirthYear(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:border-blue-400" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">Tỉnh/Thành</label>
              <select 
                id="province"
                value={province} 
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict("");
                }} 
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">-- Chọn Tỉnh/Thành --</option>
                {mockProvinces.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
              <select 
                id="district"
                value={district} 
                onChange={(e) => setDistrict(e.target.value)} 
                disabled={!province}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100"
              >
                <option value="">-- Chọn Quận/Huyện --</option>
                {filteredDistricts.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input 
              id="address"
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Lý do khám</label>
            <textarea 
              id="reason"
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:border-blue-400" 
              rows={3} 
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Hình thức thanh toán</p>
          <p className="text-xs text-gray-500 mb-2">Thanh toán sau tại cơ sở y tế</p>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name="paymentMethod" 
                checked={paymentMethod === 'cash'} 
                onChange={() => setPaymentMethod('cash')} 
                className="form-radio"
              /> 
              Thanh toán sau
            </label>
          </div>
        </div>

  <div className="bg-gray-50 p-3 rounded-md space-y-2 border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Giá khám</span>
            <span className="font-semibold text-gray-900">{doctor?.price ? `${doctor.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Phí đặt lịch</span>
            <span className="font-semibold text-gray-900">Miễn phí</span>
          </div>
          <hr className="border-t border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">Tổng cộng</span>
            <span className="font-bold text-red-600">{doctor?.price ? `${doctor.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}</span>
          </div>
        </div>

  <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-md">
          <h4 className="font-bold">LƯU Ý</h4>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li>Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ sơ khám bệnh, xin điểm thông tin chính xác.</li>
            <li>Chỉ ghi họ và tên, viết hoa những chữ cái đầu tiên. Vd: Trần Văn Phú.</li>
            <li>Quý khách vui lòng kiểm tra lại thông tin trước khi nhấn "Xác nhận".</li>
          </ul>
        </div>

        <div className="pt-2">
          <button 
            disabled={submitting} 
            type="submit" 
            className="w-full bg-[#F7D800] hover:bg-[#e6c200] text-black px-4 py-2 rounded-md font-semibold text-base transition duration-150 disabled:bg-gray-300"
          >
            {submitting ? 'Đang xử lý...' : 'Xác nhận đặt khám'}
          </button>
          
          {successMessage && <p className="text-green-600 mt-2 text-center font-semibold">{successMessage}</p>}
          {error && <p className="text-red-600 mt-2 text-center font-semibold">{error}</p>}

          <p className="text-xs text-gray-500 mt-3 text-center">
            Bằng cách xác nhận, bạn đã hoàn toàn đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng</a> dịch vụ của chúng tôi.
          </p>
        </div>
        
        <input type="hidden" name="selectedDate" value={date} />
        <input type="hidden" name="selectedTime" value={timeSlot || ""} />
        
      </form>
    </div>
    </>
  );
}