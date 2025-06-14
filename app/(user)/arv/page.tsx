"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function ARVRegimen() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dữ liệu mẫu phát đồ ARV
  const arvRegimens = [
    {
      id: 1,
      startDate: "2022-01-10",
      regimen: "TDF + 3TC + EFV",
      status: "Đang sử dụng",
      note: "Không tác dụng phụ"
    },
    {
      id: 2,
      startDate: "2021-05-01",
      regimen: "AZT + 3TC + NVP",
      status: "Đã thay đổi",
      note: "Đổi do tác dụng phụ nhẹ"
    }
  ];

  const navLinks = [
    { label: "Trang Chủ", href: "/home" },
    { label: "Bác Sĩ", href: "/doctor" },
    { label: "Đặt Lịch", href: "/booking" },
    { label: "Liên Hệ", href: "/contact" },
  ];
  const profileMenuItems = [
    { id: "edit-profile", label: "Chỉnh sửa hồ sơ" },
    { id: "lab-results", label: "Kết quả xét nghiệm" },
    { id: "medical-history", label: "Lịch sử khám bệnh" },
    { id: "arv", label: "ARV" },
    { id: "reminder-system", label: "Hệ thống nhắc nhở" },
  ];
  function handleProfileMenuClick(id: string) {
    switch (id) {
      case "edit-profile":
        window.location.href = "/userPanel/edit";
        break;
      case "lab-results":
        window.location.href = "/userPanel/lab-results";
        break;
      case "medical-history":
        window.location.href = "/userPanel/medical-history";
        break;
      case "arv":
        window.location.href = "/userPanel/arv";
        break;
      case "reminder-system":
        window.location.href = "/profile/reminders";
        break;
      default:
        break;
    }
    setShowProfileMenu(false);
  }

  return (
    <div className="min-h-0 bg-gray-100 flex items-start justify-center pt-10 px-2">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Phác đồ ARV
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-base rounded-xl overflow-hidden shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="py-3 px-6 border-b text-lg font-semibold text-center">Ngày bắt đầu</th>
                <th className="py-3 px-6 border-b text-lg font-semibold text-center">Phác đồ</th>
                <th className="py-3 px-6 border-b text-lg font-semibold text-center">Trạng thái</th>
                <th className="py-3 px-6 border-b text-lg font-semibold text-center">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {arvRegimens.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <td className="py-3 px-6 border-b text-center align-middle">{item.startDate}</td>
                  <td className="py-3 px-6 border-b text-center align-middle">{item.regimen}</td>
                  <td className="py-3 px-6 border-b text-center align-middle">{item.status}</td>
                  <td className="py-3 px-6 border-b text-center align-middle">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
