import { z } from "zod";

/** Schema dùng chung cho form thêm / chỉnh địa chỉ giao hàng. */
export const addressSchema = z.object({
    full_name: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
    phone: z.string().min(10, "SĐT tối thiểu 10 số"),
    province: z.string().min(1, "Vui lòng nhập tỉnh/thành"),
    district: z.string().min(1, "Vui lòng nhập quận/huyện"),
    ward: z.string().min(1, "Vui lòng nhập phường/xã"),
    street: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
