import type { ContactRequest } from "@/types/contact";

export const CONTACTS: ContactRequest[] = [
  {
    id: "1",
    name: "Nguyễn Văn Minh",
    company: "Tổng Công ty Xăng Dầu Việt Nam",
    email: "minh.nv@petrolimex.com.vn",
    phone: "+84 91 234 5678",
    subject: "Yêu cầu báo giá máy bơm FP-500X",
    message: "Chúng tôi cần báo giá cho 5 máy bơm FP-500X để lắp đặt tại 5 trạm xăng trong quý 1/2025.",
    status: "new",
    createdAt: "2024-12-01T08:30:00Z",
  },
  {
    id: "2",
    name: "Trần Thị Lan",
    company: "Công ty CP Dầu khí Hải Phòng",
    email: "lan.tt@haiphongoil.vn",
    phone: "+84 90 876 5432",
    subject: "Hỗ trợ kỹ thuật đồng hồ đo FM-Digital",
    message: "Đồng hồ đo FM-Digital-Pro lắp tháng trước hiển thị sai số đo. Cần kỹ thuật viên hỗ trợ kiểm tra.",
    status: "in-progress",
    createdAt: "2024-11-28T14:15:00Z",
  },
  {
    id: "3",
    name: "Lê Hoàng Nam",
    company: "Cảng Hàng không Quốc tế Nội Bài",
    email: "nam.lh@noi-bai.vn",
    phone: "+84 98 765 4321",
    subject: "Dự án hệ thống nhiên liệu hàng không",
    message: "Chúng tôi đang lập kế hoạch nâng cấp hệ thống cấp nhiên liệu cho toàn bộ nhà ga. Vui lòng tư vấn giải pháp.",
    status: "new",
    createdAt: "2024-11-25T09:00:00Z",
  },
  {
    id: "4",
    name: "Phạm Đức Thịnh",
    company: "Nhà máy nhiệt điện Phả Lại",
    email: "thinh.pd@phalaiplant.vn",
    phone: "+84 97 654 3210",
    subject: "Báo giá bồn chứa UST-3000",
    message: "Cần báo giá 3 bồn chứa ngầm UST-3000 cho dự án mở rộng nhà máy. Thời gian triển khai dự kiến tháng 3/2025.",
    status: "resolved",
    createdAt: "2024-11-20T11:30:00Z",
  },
  {
    id: "5",
    name: "Hoàng Thị Mai",
    company: "Tập đoàn TH Group",
    email: "mai.ht@thgroup.vn",
    phone: "+84 93 456 7890",
    subject: "Hợp tác phân phối thiết bị",
    message: "TH Group muốn trở thành đối tác phân phối sản phẩm FuelPrecision tại khu vực miền Trung và Tây Nguyên.",
    status: "in-progress",
    createdAt: "2024-11-18T16:45:00Z",
  },
  {
    id: "6",
    name: "Vũ Thanh Sơn",
    company: "Công ty TNHH Logistics ABC",
    email: "son.vt@abclogistics.vn",
    phone: "+84 94 321 0987",
    subject: "Tư vấn hệ thống giám sát từ xa",
    message: "Chúng tôi có 12 xe bồn và muốn lắp hệ thống giám sát nhiên liệu từ xa. Xin tư vấn giải pháp phù hợp.",
    status: "new",
    createdAt: "2024-11-15T10:00:00Z",
  },
  {
    id: "7",
    name: "Đặng Quốc Hùng",
    company: "Petro Vietnam Gas",
    email: "hung.dq@pvgas.com.vn",
    phone: "+84 91 999 8888",
    subject: "Yêu cầu demo sản phẩm FP-CTRL-Pro",
    message: "Chúng tôi quan tâm đến bộ điều khiển thông minh FP-CTRL-Pro. Đề nghị sắp xếp buổi demo tại văn phòng.",
    status: "resolved",
    createdAt: "2024-11-10T13:20:00Z",
  },
  {
    id: "8",
    name: "Ngô Thị Hương",
    email: "huong.nt@gmail.com",
    phone: "+84 96 777 6655",
    subject: "Câu hỏi về chính sách bảo hành",
    message: "Máy bơm FP-500X tôi mua cách đây 18 tháng bắt đầu có tiếng ồn bất thường. Chính sách bảo hành như thế nào?",
    status: "new",
    createdAt: "2024-12-02T07:50:00Z",
  },
];

export function getContacts(): ContactRequest[] {
  return [...CONTACTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getContactById(id: string): ContactRequest | undefined {
  return CONTACTS.find((c) => c.id === id);
}

export function getContactStats() {
  return {
    total: CONTACTS.length,
    newCount: CONTACTS.filter((c) => c.status === "new").length,
    inProgressCount: CONTACTS.filter((c) => c.status === "in-progress").length,
    resolvedCount: CONTACTS.filter((c) => c.status === "resolved").length,
  };
}
