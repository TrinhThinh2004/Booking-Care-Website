import { Suspense } from 'react'
import PaymentResultContent from '@/components/ui/PaymentResultContent'

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div>Đang xử lý kết quả thanh toán...</div>}>
      <PaymentResultContent />
    </Suspense>
  )
}
