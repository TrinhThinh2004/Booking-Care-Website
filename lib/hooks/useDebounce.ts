import { useEffect, useState } from 'react'

/**
 * Hook để debounce giá trị, giúp tránh gọi API liên tục khi người dùng nhập liệu
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay (ms), mặc định 500ms
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set timeout để delay việc cập nhật giá trị
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: hủy timeout nếu value thay đổi trước khi delay kết thúc
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

