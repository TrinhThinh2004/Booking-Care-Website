# BookingCare  Website đặt lịch khám trực tuyến

Một dự án demo/ứng dụng thực tế để quản lý và đặt lịch khám bệnh trực tuyến, xây dựng bằng Next.js, Node.js và MySQL.

## Tính năng chính
- Đặt lịch khám cho bệnh nhân
- Thanh toán (VNPay integration)
- Quản lý bác sĩ, phòng khám và lịch hẹn (Admin)
- Xác thực và phân quyền (JWT)

## Kiến trúc & Công nghệ
- Frontend: Next.js (App Router, React, TailwindCSS)
- Backend: Node.js, Express (API routes / server-side logic)
- Cơ sở dữ liệu: MySQL (Sequelize ORM)
- Thanh toán: VNPay
- Xác thực: JWT

## Yêu cầu
- Node.js >= 18
- npm / pnpm / yarn
- MySQL database

## Biến môi trường (ví dụ trong `.env`)
- `DB_HOST`  MySQL host
- `DB_USER`  MySQL user
- `DB_PASSWORD`  MySQL password
- `DB_NAME`  Database name
- `DB_PORT`  MySQL port (3306)
- `JWT_SECRET`  Khoá JWT
- `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_RETURN_URL`  cấu hình VNPay

Điều chỉnh `.env` theo môi trường của bạn trước khi chạy.

## Cài đặt & Khởi chạy (phát triển)
1. Cài dependencies:

```bash
npm install
# hoặc pnpm install / yarn
```

2. Thiết lập database và chạy migration/seed:

```bash
# thực hiện migration
npx sequelize-cli db:migrate

# chạy seed (nếu có)
npx sequelize-cli db:seed:all
```

3. Chạy server phát triển:

```bash
npm run dev
# truy cập http://localhost:3000
```

## Scripts hữu ích
- `npm run dev`  chạy môi trường phát triển
- `npm run build`  build cho production
- `npm start`  chạy production (sau build)
- `npx sequelize-cli db:migrate`  chạy migration
- `npx sequelize-cli db:seed:all`  chạy seed

## API chính
- `GET /api/bookings`  danh sách lịch hẹn
- `GET /api/clinics`  danh sách phòng khám
- `GET /api/admin/stats`  thống kê cho admin (kèm recent bookings)

## Cấu trúc thư mục (tóm tắt)
- `app/`  Next.js App Router pages & layouts
- `components/`  React components
- `lib/`  helpers, hooks, database models
- `api/` hoặc `app/api/`  server API routes
- `public/`  assets
- `db/`, `lib/database/`  Sequelize models, migrations, seeders

## Debug & Troubleshooting
- Lỗi route dynamic: với Next.js App Router, handler nhận `params` như `Promise<{ id: string }>` và cần `await params` trước khi đọc `params.id`.
- Nếu xóa/update không thành công: kiểm tra console/server logs và quyền của DB.

## Góp ý & Liên hệ
Nếu cần trợ giúp thêm hoặc muốn mình chuẩn hoá file môi trường / tạo script deploy, cho mình biết.

---
File README đã được cập nhật tại root của dự án.
