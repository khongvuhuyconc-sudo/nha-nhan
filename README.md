# Cleanzy

**Cleanzy** là dịch vụ dọn dẹp nhà cửa theo giờ, mang đến giải pháp chăm sóc không gian sống tiện lợi cho các gia đình, căn hộ và nhà phố.

Chúng tôi hiểu rằng cuộc sống bận rộn khiến bạn không có nhiều thời gian dành cho việc nhà. Vì vậy, Cleanzy ra đời với mong muốn giúp bạn tiết kiệm thời gian, giảm bớt áp lực công việc nhà và tận hưởng một không gian sống sạch sẽ, thoáng đãng hơn.

Với đội ngũ nhân viên tận tâm, quy trình làm việc rõ ràng và mức giá minh bạch, Cleanzy luôn hướng đến trải nghiệm dịch vụ thuận tiện, chu đáo và đáng tin cậy.

**Cleanzy** – Sạch không gian, nhẹ cuộc sống.

## Tính năng

- **Giới thiệu dịch vụ** — Cleanzy là ai và cam kết với khách hàng.
- **Mô tả dịch vụ theo diện tích** — 2 giờ ≈ 55 m², 3 giờ ≈ 85 m², 4 giờ ≈ 105 m², kèm danh sách công việc của từng gói.Nhân viên thực hiện các công việc vệ sinh theo quy trình, chú trọng sự sạch sẽ và gọn gàng trong từng khu vực.
- **Đặt lịch & báo giá** — giá 250.000–400.000đ/ca, phụ phí cuối tuần / sau 17:00 / vệ sinh kỹ, có trần giá. Yêu cầu được lưu vào cơ sở dữ liệu với mã tham chiếu.
- **Voucher khách quen** — tự động theo số điện thoại: giảm 5% từ lần đặt thứ 3, 10% từ lần thứ 6, 15% từ lần thứ 10. Có ô kiểm tra ưu đãi.
- **Chăm sóc khách hàng** — Khách có thể chấm sao và nhận xét, điểm trung bình được lưu và hiển thị công khai. Khách có thể chọn nhân viên mong muốn khi đặt lịch.Tiếp nhận phản hồi và đánh giá sau mỗi lần sử dụng dịch vụ để từng bước cải thiện chất lượng.

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
