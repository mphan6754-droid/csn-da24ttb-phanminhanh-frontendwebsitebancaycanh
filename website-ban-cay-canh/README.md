# Green Garden

Website bán cây cảnh, xây dựng bằng React, TypeScript, Vite và Tailwind CSS.

## Chạy dự án

Mở Terminal tại thư mục `website-ban-cay-canh`, sau đó chạy:

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong Terminal. Kiểm tra mã nguồn và tạo bản build bằng:

```bash
npm run lint
npm run build
```

## Đưa website lên Vercel

1. Đẩy repository lên GitHub rồi tạo project mới trong Vercel và import repository đó.
2. Chọn **Root Directory** là `website-ban-cay-canh`.
3. Dùng cấu hình Vite mặc định: lệnh build `npm run build`, thư mục output `dist`.
4. Đặt tên project là `greengardenshop` nếu tên còn khả dụng. Sau khi deploy, Vercel sẽ cấp URL dạng `https://greengardenshop.vercel.app`.

`vercel.json` cấu hình fallback cho các đường dẫn nội bộ của ứng dụng React khi tải trực tiếp hoặc refresh trang.

## Các file cấu hình và khởi động

| File | Nội dung |
| --- | --- |
| `index.html` | Khung HTML ban đầu, metadata, favicon và phần tử gốc để React hiển thị. |
| `package.json` | Thông tin dự án, thư viện và các lệnh `dev`, `build`, `lint`. |
| `package-lock.json` | Khóa phiên bản thư viện đã cài để các máy cài đặt nhất quán. |
| `vite.config.ts` | Cấu hình Vite và các plugin dùng khi chạy/build dự án. |
| `vercel.json` | Cấu hình đường dẫn fallback của ứng dụng khi deploy lên Vercel. |
| `eslint.config.js` | Quy tắc kiểm tra chất lượng mã nguồn. |
| `tsconfig.json` | Cấu hình TypeScript gốc, kết nối các cấu hình con. |
| `tsconfig.app.json` | Cấu hình TypeScript cho ứng dụng React. |
| `tsconfig.node.json` | Cấu hình TypeScript cho các công cụ chạy bằng Node.js. |
| `README.md` | Hướng dẫn chạy dự án và tra cứu vai trò các file. |

## Mã nguồn trong `src/`

| File | Nội dung |
| --- | --- |
| `main.tsx` | Điểm khởi chạy React và nạp CSS toàn cục. |
| `App.tsx` | Chọn trang hiển thị theo đường dẫn URL và bọc ứng dụng với quản lý giỏ hàng. |
| `index.css` | CSS toàn cục, Tailwind CSS và một số quy tắc giao diện chung. |
| `TrangChu.tsx` | Trang chủ, banner, nhóm sản phẩm và sản phẩm nổi bật. |
| `SanPham.tsx` | Danh sách 41 sản phẩm thuộc 4 nhóm, dữ liệu và ảnh sản phẩm. |
| `TheSanPham.tsx` | Thẻ sản phẩm và nút thêm sản phẩm vào giỏ hàng. |
| `ChiTietSanPham.tsx` | Trang thông tin chi tiết của một sản phẩm. |
| `CartContext.tsx` | Khai báo kiểu dữ liệu và các thao tác giỏ hàng dùng chung giữa các trang. |
| `QuanLyGioHang.tsx` | Cung cấp trạng thái giỏ hàng, cập nhật số lượng và lưu giỏ vào trình duyệt. |
| `GioHang.tsx` | Menu giỏ hàng nhanh trên thanh điều hướng. |
| `DLieuGioHangPage.tsx` | Trang giỏ hàng đầy đủ, tính tạm tính và phí giao hàng. |
| `ThanhToan.tsx` | Biểu mẫu thanh toán mô phỏng và xác nhận đơn hàng. |
| `DlieuDonhangStorage.ts` | Kiểu dữ liệu đơn hàng và thao tác lưu/đọc/hủy/xóa đơn trong trình duyệt. |
| `DonHang.tsx` | Trang lịch sử và quản lý các đơn hàng mô phỏng. |
| `GioiThieu.tsx` | Trang giới thiệu cửa hàng. |
| `Lienhe.tsx` | Trang thông tin và biểu mẫu liên hệ. |
| `Dangnhap/Dangky.tsx` | Menu đăng nhập/đăng ký mô phỏng, lưu trạng thái trong phiên trình duyệt. |
## Tài nguyên tĩnh

- `public/images/`: ảnh logo, banner, cây cảnh, chậu và dụng cụ chăm sóc. Các file trong thư mục này được tham chiếu bằng đường dẫn `/images/...`.
- `public/favicon.svg`, `public/icons.svg`: biểu tượng tĩnh của website.

## Thư mục được tạo tự động

- `node_modules/` chứa các thư viện cài từ npm; không chỉnh sửa từng file bên trong.
- `dist/` là sản phẩm đầu ra do `npm run build` tạo ra.

Hai thư mục trên không phải mã nguồn cần quản lý thủ công. Không xóa file trong `src/` hoặc `public/` nếu chưa kiểm tra nơi sử dụng.
