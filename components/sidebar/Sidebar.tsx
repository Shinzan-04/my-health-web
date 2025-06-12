"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  FaUserEdit,
  FaUsers,
  FaCalendar,
  FaFlask,
  FaBell,
  FaUserCog,
  FaNotesMedical,
  FaPrescriptionBottleAlt,
  FaHistory,
  FaVial,
} from "react-icons/fa";

const menus = {
  USER: [
    { label: "Chỉnh sửa hồ sơ", href: "/userPanel/edit", icon: <FaUserEdit /> },
    { label: "Kết quả xét nghiệm", href: "/user-panel/lab-results", icon: <FaVial /> },
    { label: "Lịch sử khám bệnh", href: "/user-panel/medical-history", icon: <FaHistory /> },
    { label: "ARV", href: "/user-panel/arv", icon: <FaPrescriptionBottleAlt /> },
    { label: "Nhắc nhở", href: "/profile/reminders", icon: <FaBell /> },
  ],
  ADMIN: [
    { label: "Chỉnh sửa hồ sơ", href: "/admin/edit", icon: <FaUserEdit /> },
    { label: "Lịch sử khám/tư vấn", href: "/admin/medical-history", icon: <FaHistory /> },
    { label: "Nhập kết quả xét nghiệm", href: "/admin/lab-results", icon: <FaFlask /> },
    { label: "Tiến trình điều trị", href: "/admin/reminder-system", icon: <FaNotesMedical /> },
  ],
  DOCTOR: [
    { label: "Chỉnh sửa hồ sơ", href: "/edit-profile", icon: <FaUserEdit /> },
    { label: "Bệnh nhân điều trị", href: "/doctor/patients", icon: <FaUsers /> },
    { label: "Hồ sơ bệnh nhân", href: "/doctor/records", icon: <FaNotesMedical /> },
    { label: "Nhắc thuốc", href: "/doctor/reminders", icon: <FaBell /> },
    { label: "Phác đồ điều trị", href: "/doctor/treatment-plan", icon: <FaPrescriptionBottleAlt /> },
    { label: "Lịch làm việc", href: "/schedule", icon: <FaCalendar /> },
  ],
};

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const authData = localStorage.getItem("authData");
      if (authData) {
        const { token } = JSON.parse(authData);
        if (token) {
          const decoded = jwtDecode<{ role?: string }>(token);
          if (decoded?.role) {
            setRole(decoded.role);
          }
        }
      }
    } catch (err) {
      console.error("Lỗi khi giải mã token:", err);
    }
  }, []);

  const items = role ? menus[role as keyof typeof menus] || [] : [];

  return (
    <aside className="w-64 fixed top-[140px] left-0 h-[calc(100vh-140px)] bg-white border-r z-40 pt-4">
      <h2 className="text-lg font-bold text-blue-600 mb-4 px-4">
        Chức năng ({role || "Không xác định"})
      </h2>
      <nav className="space-y-2 px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-blue-100 ${
              pathname === item.href ? "bg-blue-100 font-semibold" : ""
            }`}
          >
            <span className="text-blue-600">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
