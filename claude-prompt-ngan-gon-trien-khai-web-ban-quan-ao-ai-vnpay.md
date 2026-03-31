# Prompt ngắn gọn cho Claude Agent

Bạn hãy triển khai một web app full-stack cho đồ án tốt nghiệp với tên đề tài:

**Hệ Thống Bán Quần Áo Trực Tuyến Ứng Dụng Chatbot AI và Thanh Toán VNPay**

## 1. Tech stack bắt buộc
- Frontend: **Next.js 14+ App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**
- Backend: **Supabase** gồm PostgreSQL, Auth, Storage, RLS
- Form/validation: React Hook Form + Zod
- Thanh toán: **VNPay**
- Chatbot: AI chatbot tích hợp qua server route/API route

## 2. Mục tiêu hệ thống
Xây dựng website bán quần áo trực tuyến có:
- duyệt sản phẩm, tìm kiếm, lọc, xem chi tiết
- giỏ hàng, checkout, đặt hàng
- thanh toán COD và VNPay
- đăng ký, đăng nhập, quản lý tài khoản
- theo dõi đơn hàng
- đánh giá sản phẩm
- chatbot AI tư vấn sản phẩm và trả lời FAQ
- admin panel quản lý sản phẩm, đơn hàng, danh mục, voucher, banner, chatbot knowledge

## 3. Các route/pages chính cần có
### Public
- `/` trang chủ
- `/products` danh sách sản phẩm
- `/products/[slug]` chi tiết sản phẩm
- `/collections/[slug]` danh sách theo bộ sưu tập hoặc danh mục
- `/search` tìm kiếm sản phẩm
- `/cart` giỏ hàng
- `/checkout` thanh toán
- `/checkout/result` kết quả thanh toán VNPay
- `/about`
- `/contact`
- `/policies/shipping`
- `/policies/return`
- `/policies/privacy`
- `/policies/terms`

### Auth
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

### User account
- `/account`
- `/account/profile`
- `/account/addresses`
- `/account/orders`
- `/account/orders/[id]`
- `/account/wishlist`
- `/account/reviews`

### Admin
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/categories`
- `/admin/brands`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/customers`
- `/admin/reviews`
- `/admin/vouchers`
- `/admin/banners`
- `/admin/chatbot`
- `/admin/settings`

## 4. Chức năng nghiệp vụ cốt lõi
### Sản phẩm
- Quần áo có biến thể theo **size, màu, tồn kho, giá**
- Hỗ trợ ảnh chính + gallery
- Có danh mục, thương hiệu, tag, mô tả, giá gốc, giá giảm, trạng thái active/inactive
- Cho phép hiển thị sản phẩm nổi bật, mới, bán chạy

### Giỏ hàng
- Thêm/xóa/cập nhật số lượng
- Chỉ cho checkout khi biến thể còn hàng
- Có thể lưu giỏ hàng theo user; guest cart có thể lưu local/session

### Checkout
- Chọn địa chỉ giao hàng
- Chọn phương thức thanh toán: COD hoặc VNPay
- Áp dụng voucher nếu hợp lệ
- Tính tổng tiền gồm subtotal, discount, shipping fee, final total
- Khi đặt hàng phải tạo order + order items + payment record

### VNPay
- Tạo payment URL ở server
- Redirect sang VNPay
- Có return URL / callback URL
- Verify checksum server-side
- Cập nhật payment status và order status an toàn, chống cập nhật lặp

### Đơn hàng
- Trạng thái gợi ý:
  - `pending`
  - `awaiting_payment`
  - `paid`
  - `processing`
  - `shipping`
  - `completed`
  - `cancelled`
  - `payment_failed`
- User xem lịch sử đơn hàng, chi tiết đơn, hủy đơn nếu chưa xử lý
- Admin cập nhật trạng thái đơn

### Review
- Chỉ user đã mua và đơn đã hoàn thành mới được review
- Review gồm rating, comment, thời gian tạo, trạng thái hiển thị

### Chatbot AI
- Widget chat nổi ở public pages
- Trả lời FAQ: size, đổi trả, giao hàng, thanh toán
- Có thể gợi ý sản phẩm theo nhu cầu: giới tính, kiểu dáng, màu sắc, giá, size
- Dữ liệu tư vấn có thể lấy từ FAQ + product catalog trong Supabase
- Thiết kế theo hướng dễ mở rộng RAG/semantic search sau này

### Admin
- CRUD sản phẩm, danh mục, thương hiệu, banner, voucher
- Quản lý đơn hàng, review, khách hàng cơ bản
- Quản lý nội dung FAQ/knowledge cho chatbot
- Dashboard có thống kê đơn hàng, doanh thu, sản phẩm nổi bật, số lượng user

## 5. Data model tối thiểu trong Supabase
Hãy thiết kế schema rõ ràng, có migration/seed cơ bản cho các bảng sau:
- `profiles`
- `addresses`
- `categories`
- `brands`
- `products`
- `product_variants`
- `product_images`
- `carts`
- `cart_items`
- `wishlists`
- `orders`
- `order_items`
- `payments`
- `vouchers`
- `reviews`
- `banners`
- `chatbot_faqs`
- `chatbot_conversations`
- `chatbot_messages`

Yêu cầu thêm:
- có khóa ngoại đầy đủ
- có timestamp `created_at`, `updated_at`
- slug cho category/product nếu cần SEO
- inventory nằm ở product variant
- dùng enum hoặc check constraint cho status quan trọng
- có RLS policy hợp lý cho user/admin

## 6. Yêu cầu kiến trúc và code
- Tổ chức project theo module: `auth`, `catalog`, `cart`, `checkout`, `orders`, `profile`, `chatbot`, `admin`
- Ưu tiên Server Components cho các trang SEO và Client Components cho phần tương tác mạnh
- Sử dụng server actions hoặc route handlers cho logic nhạy cảm
- Không để lộ secret key ở client
- VNPay logic và chatbot API phải chạy server-side
- Code clean, typed, dễ mở rộng
- Tạo reusable UI components bằng shadcn/ui
- Responsive tốt cho desktop/tablet/mobile
- Có loading, empty state, error state

## 7. Yêu cầu UX/UI
- Phong cách hiện đại, sạch, phù hợp website bán quần áo
- Có header, footer, breadcrumb, filter sidebar, sort, pagination
- Trang chi tiết sản phẩm có gallery, chọn size/màu, số lượng, mô tả, review, sản phẩm liên quan
- Trang admin dùng table, form dialog/sheet, badge status, chart thống kê cơ bản

## 8. Bảo mật và nghiệp vụ cần chú ý
- Phân quyền rõ guest / customer / admin
- Không cho đặt vượt tồn kho
- Không cho fake payment success từ client
- Kiểm tra voucher hợp lệ theo thời gian, trạng thái, số lượng, điều kiện đơn tối thiểu
- Chỉ user sở hữu đơn hàng mới xem được đơn của họ
- Chỉ admin mới vào được admin routes

## 9. Kết quả mong muốn từ bạn
Hãy sinh ra codebase hoàn chỉnh, production-oriented ở mức đồ án tốt nghiệp, gồm:
1. cấu trúc thư mục chuẩn
2. schema Supabase + migration/seed mẫu
3. toàn bộ pages/layout/components chính
4. logic auth, catalog, cart, checkout, order, review, admin
5. tích hợp VNPay server-side
6. chatbot API + UI widget
7. dữ liệu mẫu để demo
8. hướng dẫn chạy local và biến môi trường `.env`

## 10. Cách làm việc
- Tự chủ động suy luận các chi tiết phụ còn thiếu nhưng phải bám sát đề tài
- Ưu tiên hoàn thiện luồng nghiệp vụ end-to-end trước
- Nếu khối lượng lớn, hãy triển khai theo thứ tự:
  1. database + auth
  2. catalog + product detail
  3. cart + checkout
  4. VNPay
  5. account + orders
  6. admin panel
  7. chatbot AI
- Mặc định code bằng TypeScript
- Không đổi stack công nghệ
