import { ReactNode } from "react";
import { Truck, RefreshCcw, ShieldCheck, FileText } from "lucide-react";

export type PolicySection = {
    title: string;
    content: string;
};

export type PolicyConfig = {
    id: string;
    title: string;
    icon: React.ElementType;
    description: string;
    updatedAt: string;
    sections: PolicySection[];
};

export const POLICIES: PolicyConfig[] = [
    {
        id: "shipping",
        title: "Chính sách vận chuyển",
        icon: Truck,
        description: "Thông tin về phương thức, thời gian và chi phí vận chuyển đơn hàng.",
        updatedAt: "10/04/2026",
        sections: [
            {
                title: "1. Phương thức vận chuyển",
                content: "Nana Store sử dụng các dịch vụ giao hàng uy tín như Giao Hàng Nhanh, Giao Hàng Tiết Kiệm và Viettel Post để đảm bảo đơn hàng của bạn được giao đến nơi an toàn và nhanh chóng. Tất cả đơn hàng đều có thể được theo dõi trực tuyến."
            },
            {
                title: "2. Thời gian giao hàng",
                content: "Khu vực nội thành TP.HCM: 1-2 ngày làm việc.\nKhu vực ngoại thành và các tỉnh lân cận: 3-4 ngày làm việc.\nCác tỉnh thành khác: 4-6 ngày làm việc.\nThời gian giao hàng có thể thay đổi tùy thuộc vào điều kiện thời tiết hoặc các dịp lễ Tết."
            },
            {
                title: "3. Chi phí vận chuyển",
                content: "Phí vận chuyển đồng giá tiêu chuẩn là 30.000 VNĐ cho mọi đơn hàng. Miễn phí vận chuyển cho đơn hàng từ 1.000.000 VNĐ."
            },
            {
                title: "4. Kiểm tra mã vận đơn",
                content: "Sau khi đơn hàng được gửi cho bưu tá, bạn sẽ nhận được một email chứa đường link và mã vận đơn để theo dõi hành trình đơn hàng. Hoặc bạn có thể truy cập mục 'Đơn hàng của tôi' trên website để cập nhật tình trạng."
            }
        ]
    },
    {
        id: "return",
        title: "Chính sách đổi trả",
        icon: RefreshCcw,
        description: "Quy định và thủ tục đổi/trả sản phẩm của Nana Store.",
        updatedAt: "08/04/2026",
        sections: [
            {
                title: "1. Điều kiện đổi trả",
                content: "Sản phẩm được hỗ trợ đổi size hoặc trả lỗi trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên mác, nhãn, thẻ bài, chưa qua sử dụng, chưa qua giặt ủi, không có mùi lạ và không bị hư hỏng."
            },
            {
                title: "2. Các trường hợp không hỗ trợ",
                content: "Sản phẩm giảm giá (Sale) từ 50% trở lên không áp dụng chính sách đổi trả, trừ khi có lỗi từ nhà sản xuất. Sản phẩm đồ lót, phụ kiện (vớ, trang sức) không được đổi trả vì lý do vệ sinh."
            },
            {
                title: "3. Quy trình thực hiện",
                content: "Bước 1: Liên hệ với bộ phận CSKH qua số Hotline hoặc Zalo.\nBước 2: Cung cấp mã đơn hàng, video/hình ảnh mở kiện hàng, và tình trạng sản phẩm.\nBước 3: Gửi sản phẩm về địa chỉ kho của Nana Store.\nBước 4: Nana Store sẽ kiểm tra và tiến hành gửi sản phẩm mới hoặc hoàn tiền."
            },
            {
                title: "4. Chi phí đổi trả",
                content: "Trong trường hợp lỗi do nhà sản xuất hoặc nhầm sản phẩm, Nana Store sẽ chịu 100% phí vận chuyển. Nếu đổi size theo nhu cầu khách hàng, khách hàng vui lòng thanh toán phí chuyển phát 2 chiều."
            }
        ]
    },
    {
        id: "privacy",
        title: "Chính sách bảo mật",
        icon: ShieldCheck,
        description: "Cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
        updatedAt: "01/01/2026",
        sections: [
            {
                title: "1. Thu thập thông tin",
                content: "Nana Store thu thập các thông tin cá nhân bao gồm họ tên, số điện thoại, email và địa chỉ nhận hàng nhằm phục vụ cho quá trình xử lý đơn hàng, thanh toán và vận chuyển. Chúng tôi cũng thu thập cookie để cá nhân hóa trải nghiệm duyệt web của bạn."
            },
            {
                title: "2. Sử dụng thông tin",
                content: "Thông tin của bạn được sử dụng để xác nhận đơn hàng, gửi thông báo vận chuyển, cung cấp hỗ trợ và cung cấp các gợi ý mua sắm phù hợp. Nana Store cam kết không bán, trao đổi hoặc cho thuê thông tin nhận dang cá nhân cho bất kỳ bên thứ 3 nào."
            },
            {
                title: "3. Bảo mật giao dịch",
                content: "Mọi giao dịch thanh toán qua thẻ quốc tế và nội địa (VNPay, Thẻ tín dụng/ghi nợ) đều được mã hóa bằng chuẩn SSL (Secure Sockets Layer) và thực hiện trên nền tảng an toàn của đối tác thanh toán VNPay."
            },
            {
                title: "4. Quyền của khách hàng",
                content: "Khách hàng có quyền yêu cầu xem, chỉnh sửa hoặc xóa các dữ liệu cá nhân (tài khoản) đã lưu trữ tại hệ thống của chúng tôi bất cứ lúc nào."
            }
        ]
    },
    {
        id: "terms",
        title: "Điều khoản sử dụng",
        icon: FileText,
        description: "Các điều khoản pháp lý khi truy cập và mua sắm tại Nana Store.",
        updatedAt: "01/01/2026",
        sections: [
            {
                title: "1. Chấp thuận điều khoản",
                content: "Bằng việc truy cập, duyệt và mua sắm trên website của Nana Store, bạn mặc nhiên đồng ý tuân thủ các Điều khoản sử dụng này. Vui lòng đọc kỹ trước khi sử dụng dịch vụ."
            },
            {
                title: "2. Quyền sở hữu trí tuệ",
                content: "Toàn bộ hình ảnh, nội dung, thiết kế, đồ họa, tệp dữ liệu âm thanh/video trên website là tài sản trí tuệ của Nana Store, được bảo hộ bởi luật sở hữu trí tuệ Việt Nam. Hành vi sao chép, phân phối vì mục đích thương mại khi chưa có sự cho phép bằng văn bản đều bị nghiêm cấm."
            },
            {
                title: "3. Thông tin sản phẩm và giá cả",
                content: "Chúng tôi cố gắng đảm bảo mọi thông tin sản phẩm và giá hiển thị trên website là chính xác nhất tại thời điểm mua hàng. Do một số yếu tố khách quan, màu sắc thực tế có thể có đôi chút chênh lệch so với màn hình hiển thị. Nana Store có quyền thay đổi giá và cập nhật mẫu mã mà không cần báo trước."
            },
            {
                title: "4. Giới hạn trách nhiệm",
                content: "Nana Store không chịu trách nhiệm cho bất kỳ tổn thất, thiệt hại trực tiếp hoặc gián tiếp nào phát sinh trong quá trình sử dụng website hoặc không thể sử dụng website do lỗi kỹ thuật mạng độc lập."
            }
        ]
    }
];
