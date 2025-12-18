'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button' 

export default function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực giao dịch...');

  const vnp_Amount = searchParams?.get('vnp_Amount');
  const vnp_TxnRef = searchParams?.get('vnp_TxnRef');
  const vnp_BankCode = searchParams?.get('vnp_BankCode');

  const formatCurrency = (amount: string | null | undefined) => {
    if (!amount) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(Number(amount) / 100);
  }

  useEffect(() => {
    const verifyPayment = async () => {
        if (!searchParams) return;
        const queryString = searchParams.toString();
        
        try {
            const res = await fetch(`/api/vnpay/return?${queryString}`);
            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setMessage('Giao dịch được xác nhận thành công.');
            } else {
                setStatus('error');
                setMessage(data.message || 'Giao dịch thất bại hoặc bị hủy.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Lỗi kết nối tới hệ thống máy chủ.');
            console.error(error);
        }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen bg-[#58C9D7] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center transition-all duration-300 transform">
      

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-700">Đang xử lý...</h2>
            <p className="text-gray-500 text-sm">Vui lòng không tắt trình duyệt</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h2>
              <p className="text-gray-500 mt-2">{message}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 border border-gray-100">
                <div className="flex justify-between">
                    <span className="text-gray-500">Mã đơn hàng:</span>
                    <span className="font-medium text-gray-900">{vnp_TxnRef}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Ngân hàng:</span>
                    <span className="font-medium text-gray-900">{vnp_BankCode}</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Tổng thanh toán:</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(vnp_Amount)}</span>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="ghost"
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
              >
                Về trang chủ
              </Button>
              <Button 
                variant="ghost"
                onClick={() => router.push(`/dashboard/my-bookings`)} 
                className="flex-1 bg-[#92D7EE] hover:bg-[#70c7e0] text-gray-900 font-medium"
              >
                Xem lịch hẹn
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
             <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800">Thanh toán thất bại</h2>
                <p className="text-red-500 mt-2 font-medium">{message}</p>
                <p className="text-gray-400 text-sm mt-1">Vui lòng thử lại hoặc liên hệ CSKH</p>
            </div>

             <div className="bg-red-50 rounded-lg p-4 text-sm border border-red-100">
                <div className="flex justify-between">
                    <span className="text-gray-500">Mã giao dịch:</span>
                    <span className="font-medium text-gray-900">{vnp_TxnRef}</span>
                </div>
             </div>

            <div className="pt-2">
                <Button 
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="w-full bg-[#92D7EE] hover:bg-[#70c7e0] text-gray-900 font-medium"
                >
                  Quay lại trang chủ
                </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}