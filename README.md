# Cleanzy

Trang web đặt lịch dọn nhà theo giờ của **Cleanzy**. Khách hàng chọn dịch vụ, địa chỉ, ngày giờ và thời lượng, xem báo giá ngay lập tức rồi gửi yêu cầu để được gọi xác nhận.

## Tính năng

- **Giới thiệu dịch vụ** — Cleanzy là ai và cam kết với khách hàng.
- **Mô tả dịch vụ theo diện tích** — 2 giờ ≈ 55 m², 3 giờ ≈ 85 m², 4 giờ ≈ 105 m², kèm danh sách công việc của từng gói.
- **Đặt lịch & báo giá** — giá 250.000–400.000đ/ca, phụ phí cuối tuần / sau 17:00 / vệ sinh kỹ, có trần giá. Yêu cầu được lưu vào cơ sở dữ liệu với mã tham chiếu.
- **Voucher khách quen** — tự động theo số điện thoại: giảm 5% từ lần đặt thứ 3, 10% từ lần thứ 6, 15% từ lần thứ 10. Có ô kiểm tra ưu đãi.
- **Đánh giá nhân viên** — 7 nhân viên, chấm sao và nhận xét, điểm trung bình được lưu và hiển thị công khai. Khách có thể chọn nhân viên mong muốn khi đặt lịch.

## Công nghệ

- TanStack Start (React 19, TanStack Router, Vite)
- Netlify Database (Postgres) với Drizzle ORM
- Netlify Image CDN cho ảnh hero
- lucide-react cho icon, CSS thuần trong `src/site.css`

## Chạy trên máy

```bash
pnpm install
netlify dev
```

`netlify dev` giả lập Netlify Database và Image CDN. Khi thay đổi `db/schema.ts`, tạo migration mới bằng:

```bash
npx drizzle-kit generate --name <ten_thay_doi>
```

Migration được Netlify tự áp dụng khi deploy.

## Hướng phát triển tiếp

- Trang quản trị để xem, xác nhận hoặc hủy yêu cầu đặt lịch (cần đăng nhập).
- Chỉ tính các lần đặt đã hoàn thành vào hạng voucher khi có trạng thái xác nhận.
- Chỉ cho phép đánh giá nhân viên đã thực sự phục vụ (gắn với mã yêu cầu).
