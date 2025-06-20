"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import {
  FaUserShield,
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
  FaChartLine,
  FaClipboardList ,
} from "react-icons/fa";

const menus = {
  USER: [
    { label: "Chỉnh sửa hồ sơ", href: "/edit", icon: <FaUserEdit /> },
    { label: "Kết quả xét nghiệm", href: "/lab-results", icon: <FaVial /> },
    { label: "Lịch sử khám bệnh", href: "/medical-history", icon: <FaHistory /> },
    { label: "ARV", href: "/arv", icon: <FaPrescriptionBottleAlt /> },
    { label: "Nhắc nhở", href: "/userPanel", icon: <FaBell /> },
  ],
  DOCTOR: [
    { label: "Chỉnh sửa hồ sơ", href: "/edit-profile", icon: <FaUserEdit /> },
    { label: "Bệnh nhân điều trị", href: "/admin", icon: <FaUsers /> },
    { label: "Hồ sơ bệnh nhân", href: "/doctor/records", icon: <FaNotesMedical /> },
    { label: "Nhắc thuốc", href: "/doctor/reminders", icon: <FaBell /> },
    { label: "Phác đồ điều trị", href: "/admin/arv", icon: <FaPrescriptionBottleAlt /> },
    { label: "Lịch làm việc", href: "/schedule", icon: <FaCalendar /> },
    { label: "Kết quả xét nghiệm", href: "/admin/testresults", icon: <FaCalendar /> },
  ],
  ADMIN: {
    dashboard: [
      { label: "Dashboard", href: "/admin/dashboard", icon: <FaChartLine /> },
    ],
    profile: [
      { label: "Chỉnh sửa hồ sơ", href: "/admin/edit", icon: <FaUserEdit /> },
    ],
    management: [
      { label: "Quản lý bác sĩ", href: "/admin/doctors", icon: <FaUserShield  /> },
      { label: "Quản lý người dùng", href: "/admin/users", icon: <FaUsers /> }, 
      { label: "Lịch làm việc bác sĩ", href: "/schedule", icon: <FaCalendar /> },
      { label: "Lịch đăng ký khám", href: "/admin/list-registration", icon: <FaClipboardList /> },
    ],
    data: [
      { label: "Lịch sử khám", href: "/admin/medical-history", icon: <FaHistory /> },
      { label: "Nhập kết quả xét nghiệm", href: "/admin/lab-results", icon: <FaFlask /> },
      { label: "Tiến trình điều trị", href: "/admin/reminder-system", icon: <FaNotesMedical /> },
    ],
  },
};

function Section({
  title,
  items,
  pathname,
}: {
  title: string;
  items: { label: string; href: string; icon: JSX.Element }[];
  pathname: string;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1 px-2">
        {title}
      </h3>
      <div className="space-y-1">
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
      </div>
    </div>
  );
}

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

  const isAdmin = role === "ADMIN";
  const items = !isAdmin ? (menus[role as keyof typeof menus] || []) : [];

  return (
    <aside className="w-64 fixed top-[140px] left-0 h-[calc(100vh-140px)] bg-white border-r z-40 pt-4">
      <h2 className="text-lg font-bold text-blue-600 mb-4 px-4">
        Chức năng ({role || "Không xác định"})
      </h2>

      {isAdmin ? (
        <nav className="space-y-4 px-2 text-sm">
          <Section title="📊 Tổng quan" items={menus.ADMIN.dashboard} pathname={pathname} />
          <Section title="👤 Hồ sơ" items={menus.ADMIN.profile} pathname={pathname} />
          <Section title="🛠️ Quản lý" items={menus.ADMIN.management} pathname={pathname} />
          <Section title="💉 Dữ liệu & điều trị" items={menus.ADMIN.data} pathname={pathname} />
        </nav>
      ) : (
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
      )}
    </aside>
  );
}
