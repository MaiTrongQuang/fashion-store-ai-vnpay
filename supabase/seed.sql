-- ============================================
-- SEED DATA - LUXE Fashion Store
-- ============================================

-- Categories
INSERT INTO categories (id, name, slug, description, is_active, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Áo', 'ao', 'Các loại áo thời trang', TRUE, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Quần', 'quan', 'Các loại quần thời trang', TRUE, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Đầm/Váy', 'dam-vay', 'Đầm váy nữ thời trang', TRUE, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Phụ kiện', 'phu-kien', 'Phụ kiện thời trang', TRUE, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Áo thun', 'ao-thun', 'Áo thun nam nữ', TRUE, 5),
  ('c1000000-0000-0000-0000-000000000006', 'Áo sơ mi', 'ao-so-mi', 'Áo sơ mi công sở', TRUE, 6),
  ('c1000000-0000-0000-0000-000000000007', 'Áo khoác', 'ao-khoac', 'Áo khoác mùa đông', TRUE, 7),
  ('c1000000-0000-0000-0000-000000000008', 'Quần jean', 'quan-jean', 'Quần jean các loại', TRUE, 8),
  ('c1000000-0000-0000-0000-000000000009', 'Quần tây', 'quan-tay', 'Quần tây công sở', TRUE, 9);

-- Set parent categories
UPDATE categories SET parent_id = 'c1000000-0000-0000-0000-000000000001' WHERE slug IN ('ao-thun', 'ao-so-mi', 'ao-khoac');
UPDATE categories SET parent_id = 'c1000000-0000-0000-0000-000000000002' WHERE slug IN ('quan-jean', 'quan-tay');

-- Brands
INSERT INTO brands (id, name, slug, description) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'LUXE Original', 'luxe-original', 'Thương hiệu chính hãng LUXE Fashion'),
  ('b1000000-0000-0000-0000-000000000002', 'Urban Style', 'urban-style', 'Phong cách đường phố hiện đại'),
  ('b1000000-0000-0000-0000-000000000003', 'Classic Wear', 'classic-wear', 'Thời trang cổ điển sang trọng'),
  ('b1000000-0000-0000-0000-000000000004', 'Sporty Chic', 'sporty-chic', 'Thời trang thể thao năng động');

-- Products
INSERT INTO products (id, name, slug, description, category_id, brand_id, base_price, sale_price, is_featured, is_new, tags) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Áo Thun Basic Cotton', 'ao-thun-basic-cotton',
   'Áo thun basic chất liệu cotton 100% cao cấp, form regular fit thoáng mát. Phù hợp mọi dịp từ hàng ngày đến dạo phố.',
   'c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001',
   299000, 249000, TRUE, TRUE, ARRAY['cotton', 'basic', 'nam', 'bestseller']),

  ('a1000000-0000-0000-0000-000000000002', 'Áo Sơ Mi Oxford Slim Fit', 'ao-so-mi-oxford-slim-fit',
   'Áo sơ mi Oxford dáng slim fit, chất liệu vải Oxford dày dặn nhưng thoáng. Phù hợp đi làm và dự tiệc.',
   'c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000003',
   599000, NULL, TRUE, FALSE, ARRAY['oxford', 'slim-fit', 'nam', 'cong-so']),

  ('a1000000-0000-0000-0000-000000000003', 'Quần Jean Skinny Wash', 'quan-jean-skinny-wash',
   'Quần jean skinny wash nhẹ, co giãn tốt, thoải mái vận động. Phù hợp phong cách trẻ trung năng động.',
   'c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000002',
   699000, 559000, TRUE, TRUE, ARRAY['jean', 'skinny', 'nam', 'wash']),

  ('a1000000-0000-0000-0000-000000000004', 'Áo Khoác Bomber Premium', 'ao-khoac-bomber-premium',
   'Áo khoác bomber cao cấp, lót lông mỏng giữ ấm nhẹ nhàng. Thiết kế unisex, phù hợp cả nam và nữ.',
   'c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001',
   899000, 749000, TRUE, FALSE, ARRAY['bomber', 'premium', 'unisex', 'khoac']),

  ('a1000000-0000-0000-0000-000000000005', 'Đầm Midi Hoa Nhí', 'dam-midi-hoa-nhi',
   'Đầm midi họa tiết hoa nhí nhẹ nhàng, thiết kế vintage Pháp. Chất liệu voan lụa mềm mại, bay bổng.',
   'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003',
   799000, NULL, TRUE, TRUE, ARRAY['dam', 'midi', 'hoa', 'nu', 'vintage']),

  ('a1000000-0000-0000-0000-000000000006', 'Quần Tây Công Sở Regular', 'quan-tay-cong-so-regular',
   'Quần tây công sở form regular, chất liệu polyester pha co giãn, ly phẳng sắc nét. Phù hợp mọi dáng người.',
   'c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000003',
   499000, 399000, FALSE, FALSE, ARRAY['tay', 'cong-so', 'nam', 'regular']),

  ('a1000000-0000-0000-0000-000000000007', 'Áo Thun Oversize Streetwear', 'ao-thun-oversize-streetwear',
   'Áo thun oversize phong cách streetwear, in graphic độc quyền. Chất cotton CVC dày dặn, form rộng thoải mái.',
   'c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002',
   399000, 349000, TRUE, TRUE, ARRAY['oversize', 'streetwear', 'unisex', 'graphic']),

  ('a1000000-0000-0000-0000-000000000008', 'Áo Polo Classic', 'ao-polo-classic',
   'Áo polo cổ bẻ classic, chất liệu pique cotton co giãn. Logo thêu tinh tế, phong cách lịch lãm.',
   'c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001',
   449000, NULL, FALSE, FALSE, ARRAY['polo', 'classic', 'nam', 'the-thao']);

-- Product Images (using placeholder URLs)
INSERT INTO product_images (product_id, url, alt, is_primary, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'Áo thun basic cotton trắng', TRUE, 0),
  ('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800', 'Áo thun basic cotton - mặt sau', FALSE, 1),
  ('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'Áo sơ mi Oxford trắng', TRUE, 0),
  ('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800', 'Áo sơ mi Oxford - chi tiết', FALSE, 1),
  ('a1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'Quần jean skinny wash', TRUE, 0),
  ('a1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 'Áo khoác bomber', TRUE, 0),
  ('a1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 'Đầm midi hoa nhí', TRUE, 0),
  ('a1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', 'Quần tây công sở', TRUE, 0),
  ('a1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 'Áo thun oversize streetwear', TRUE, 0),
  ('a1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800', 'Áo polo classic', TRUE, 0);

-- Product Variants
INSERT INTO product_variants (product_id, size, color, color_hex, price, stock, sku) VALUES
  -- Áo Thun Basic Cotton
  ('a1000000-0000-0000-0000-000000000001', 'S', 'Trắng', '#ffffff', 249000, 50, 'ATBC-S-WHT'),
  ('a1000000-0000-0000-0000-000000000001', 'M', 'Trắng', '#ffffff', 249000, 80, 'ATBC-M-WHT'),
  ('a1000000-0000-0000-0000-000000000001', 'L', 'Trắng', '#ffffff', 249000, 60, 'ATBC-L-WHT'),
  ('a1000000-0000-0000-0000-000000000001', 'XL', 'Trắng', '#ffffff', 249000, 40, 'ATBC-XL-WHT'),
  ('a1000000-0000-0000-0000-000000000001', 'S', 'Đen', '#1a1a1a', 249000, 50, 'ATBC-S-BLK'),
  ('a1000000-0000-0000-0000-000000000001', 'M', 'Đen', '#1a1a1a', 249000, 90, 'ATBC-M-BLK'),
  ('a1000000-0000-0000-0000-000000000001', 'L', 'Đen', '#1a1a1a', 249000, 70, 'ATBC-L-BLK'),
  ('a1000000-0000-0000-0000-000000000001', 'M', 'Xám', '#6b7280', 249000, 45, 'ATBC-M-GRY'),
  -- Áo Sơ Mi Oxford
  ('a1000000-0000-0000-0000-000000000002', 'M', 'Trắng', '#ffffff', 599000, 30, 'ASMO-M-WHT'),
  ('a1000000-0000-0000-0000-000000000002', 'L', 'Trắng', '#ffffff', 599000, 25, 'ASMO-L-WHT'),
  ('a1000000-0000-0000-0000-000000000002', 'XL', 'Trắng', '#ffffff', 599000, 20, 'ASMO-XL-WHT'),
  ('a1000000-0000-0000-0000-000000000002', 'M', 'Xanh dương', '#3b82f6', 599000, 35, 'ASMO-M-BLU'),
  ('a1000000-0000-0000-0000-000000000002', 'L', 'Xanh dương', '#3b82f6', 599000, 30, 'ASMO-L-BLU'),
  -- Quần Jean Skinny
  ('a1000000-0000-0000-0000-000000000003', '29', 'Xanh đậm', '#1e3a5f', 559000, 40, 'QJS-29-DNV'),
  ('a1000000-0000-0000-0000-000000000003', '30', 'Xanh đậm', '#1e3a5f', 559000, 55, 'QJS-30-DNV'),
  ('a1000000-0000-0000-0000-000000000003', '31', 'Xanh đậm', '#1e3a5f', 559000, 50, 'QJS-31-DNV'),
  ('a1000000-0000-0000-0000-000000000003', '32', 'Xanh đậm', '#1e3a5f', 559000, 45, 'QJS-32-DNV'),
  ('a1000000-0000-0000-0000-000000000003', '30', 'Xanh wash', '#5b8fbe', 559000, 35, 'QJS-30-WSH'),
  -- Áo Khoác Bomber
  ('a1000000-0000-0000-0000-000000000004', 'M', 'Đen', '#1a1a1a', 749000, 25, 'AKB-M-BLK'),
  ('a1000000-0000-0000-0000-000000000004', 'L', 'Đen', '#1a1a1a', 749000, 30, 'AKB-L-BLK'),
  ('a1000000-0000-0000-0000-000000000004', 'XL', 'Đen', '#1a1a1a', 749000, 20, 'AKB-XL-BLK'),
  ('a1000000-0000-0000-0000-000000000004', 'M', 'Xanh rêu', '#4a5e3a', 749000, 20, 'AKB-M-GRN'),
  ('a1000000-0000-0000-0000-000000000004', 'L', 'Xanh rêu', '#4a5e3a', 749000, 25, 'AKB-L-GRN'),
  -- Đầm Midi Hoa Nhí
  ('a1000000-0000-0000-0000-000000000005', 'S', 'Hồng nhạt', '#fce4ec', 799000, 20, 'DMH-S-PNK'),
  ('a1000000-0000-0000-0000-000000000005', 'M', 'Hồng nhạt', '#fce4ec', 799000, 25, 'DMH-M-PNK'),
  ('a1000000-0000-0000-0000-000000000005', 'L', 'Hồng nhạt', '#fce4ec', 799000, 15, 'DMH-L-PNK'),
  ('a1000000-0000-0000-0000-000000000005', 'S', 'Xanh pastel', '#b2dfdb', 799000, 18, 'DMH-S-PST'),
  ('a1000000-0000-0000-0000-000000000005', 'M', 'Xanh pastel', '#b2dfdb', 799000, 22, 'DMH-M-PST'),
  -- Quần Tây Công Sở
  ('a1000000-0000-0000-0000-000000000006', '29', 'Đen', '#1a1a1a', 399000, 40, 'QTCS-29-BLK'),
  ('a1000000-0000-0000-0000-000000000006', '30', 'Đen', '#1a1a1a', 399000, 50, 'QTCS-30-BLK'),
  ('a1000000-0000-0000-0000-000000000006', '31', 'Đen', '#1a1a1a', 399000, 45, 'QTCS-31-BLK'),
  ('a1000000-0000-0000-0000-000000000006', '32', 'Đen', '#1a1a1a', 399000, 35, 'QTCS-32-BLK'),
  ('a1000000-0000-0000-0000-000000000006', '30', 'Navy', '#1e3a5f', 399000, 30, 'QTCS-30-NVY'),
  -- Áo Thun Oversize
  ('a1000000-0000-0000-0000-000000000007', 'M', 'Đen', '#1a1a1a', 349000, 60, 'ATO-M-BLK'),
  ('a1000000-0000-0000-0000-000000000007', 'L', 'Đen', '#1a1a1a', 349000, 70, 'ATO-L-BLK'),
  ('a1000000-0000-0000-0000-000000000007', 'XL', 'Đen', '#1a1a1a', 349000, 55, 'ATO-XL-BLK'),
  ('a1000000-0000-0000-0000-000000000007', 'M', 'Trắng', '#ffffff', 349000, 50, 'ATO-M-WHT'),
  ('a1000000-0000-0000-0000-000000000007', 'L', 'Trắng', '#ffffff', 349000, 65, 'ATO-L-WHT'),
  -- Áo Polo Classic
  ('a1000000-0000-0000-0000-000000000008', 'M', 'Trắng', '#ffffff', 449000, 35, 'APC-M-WHT'),
  ('a1000000-0000-0000-0000-000000000008', 'L', 'Trắng', '#ffffff', 449000, 40, 'APC-L-WHT'),
  ('a1000000-0000-0000-0000-000000000008', 'XL', 'Trắng', '#ffffff', 449000, 25, 'APC-XL-WHT'),
  ('a1000000-0000-0000-0000-000000000008', 'M', 'Navy', '#1e3a5f', 449000, 30, 'APC-M-NVY'),
  ('a1000000-0000-0000-0000-000000000008', 'L', 'Navy', '#1e3a5f', 449000, 35, 'APC-L-NVY');

-- Banners
INSERT INTO banners (title, subtitle, image_url, link_url, sort_order) VALUES
  ('BST Xuân Hè 2025', 'Khám phá những xu hướng thời trang mới nhất', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920', '/collections/xuan-he', 1),
  ('SALE UP TO 50%', 'Ưu đãi lớn nhất trong năm - Đừng bỏ lỡ!', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920', '/collections/sale', 2),
  ('Thời Trang Công Sở', 'Lịch lãm và chuyên nghiệp mỗi ngày', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920', '/collections/cong-so', 3);

-- Vouchers
INSERT INTO vouchers (code, type, value, min_order, max_discount, usage_limit, used_count, starts_at, expires_at) VALUES
  ('WELCOME10', 'percentage', 10, 200000, 100000, 1000, 0, '2025-01-01', '2025-12-31'),
  ('SAVE50K', 'fixed', 50000, 500000, NULL, 500, 0, '2025-01-01', '2025-12-31'),
  ('VIP20', 'percentage', 20, 1000000, 300000, 100, 0, '2025-01-01', '2025-06-30');

-- Chatbot FAQs
INSERT INTO chatbot_faqs (question, answer, category, sort_order) VALUES
  ('Làm sao để chọn size phù hợp?', 'Bạn có thể tham khảo bảng size trong phần chi tiết sản phẩm. Nếu bạn dao động giữa 2 size, chúng tôi khuyên nên chọn size lớn hơn. Bạn cũng có thể liên hệ hotline 1900-xxxx để được tư vấn trực tiếp.', 'size', 1),
  ('Chính sách đổi trả như thế nào?', 'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng. Chi phí vận chuyển đổi trả do khách hàng chịu nếu lỗi không phải từ shop.', 'doi-tra', 2),
  ('Thời gian giao hàng mất bao lâu?', 'Đơn hàng nội thành HCM/HN: 1-2 ngày. Các tỉnh thành khác: 3-5 ngày làm việc. Đơn hàng trên 500.000đ được miễn phí vận chuyển.', 'giao-hang', 3),
  ('Thanh toán VNPay có an toàn không?', 'VNPay là cổng thanh toán được cấp phép bởi Ngân hàng Nhà nước Việt Nam, đảm bảo an toàn tuyệt đối. Mọi giao dịch đều được mã hóa SSL 256-bit.', 'thanh-toan', 4),
  ('Làm thế nào để sử dụng mã giảm giá?', 'Tại bước thanh toán, nhập mã giảm giá vào ô "Mã voucher" và nhấn "Áp dụng". Hệ thống sẽ tự động tính giảm giá nếu đơn hàng đủ điều kiện.', 'thanh-toan', 5),
  ('Có ship COD không?', 'Có, chúng tôi hỗ trợ thanh toán khi nhận hàng (COD) trên toàn quốc. Bạn chỉ cần chọn phương thức "Thanh toán khi nhận hàng" tại bước checkout.', 'thanh-toan', 6);
