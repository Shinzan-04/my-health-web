"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [mounted, setMounted] = useState(false); // 👈 Thêm state kiểm tra SSR
  const router = useRouter();

  const navLinks = [
    { label: "Trang Chủ", href: "/home" },
    { label: "Bác Sĩ", href: "/doctor" },
    { label: "Liên Hệ", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];

  const userMenuItems = [
    { label: "Chỉnh sửa hồ sơ", href: "/userPanel/edit" },
    { label: "Kết quả xét nghiệm", href: "/userPanel/lab-results" },
    { label: "Lịch sử khám bệnh", href: "/userPanel/medical-history" },
    { label: "ARV", href: "/userPanel/arv" },
    { label: "Hệ thống nhắc nhở", href: "/profile/reminders" },
  ];

  const staffMenuItems = [
    { label: "Chỉnh sửa hồ sơ", href: "/staff/edit" },
    { label: "Cập nhật lịch sử khám/tư vấn", href: "/staff/medical-history" },
    { label: "Nhập kết quả xét nghiệm", href: "/staff/lab-results" },
    { label: "Cập nhật tiến trình điều trị", href: "/staff/reminder-system" },
  ];

  const doctorMenuItems = [
    { label: "Chỉnh sửa hồ sơ", href: "/edit-profile" },
    { label: "Danh sách bệnh nhân điều trị", href: "/doctor/patients" },
    { label: "Xem hồ sơ bệnh nhân", href: "/doctor/records" },
    { label: "Nhắc nhở uống thuốc", href: "/doctor/reminders" },
    { label: "Cập nhật phác đồ điều trị", href: "/doctor/treatment-plan" },
    { label: "Lịch làm việc", href: "/schedule" },
  ];

  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    const token = authData.token;
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role) {
        setUserRole(payload.role);
        setIsLoggedIn(true);
      }

      // Fetch avatar from /me if role is DOCTOR
      if (payload.role === "DOCTOR") {
        fetch("http://localhost:8080/api/doctors/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.avatarUrl) {
              setAvatarUrl(data.avatarUrl); // Không thêm localhost ở đây
            }
          })
          .catch((err) => console.error("Lỗi lấy avatar:", err));
      }
    }
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ Chặn render trước khi client load xong

  const handleProfileMenuLinkClick = (href: string) => {
    router.push(href);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authData");
    router.push("/login");
  };

  const handleProfileMenuContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getProfileMenuItems = () => {
    switch (userRole) {
      case "USER":
        return userMenuItems;
      case "STAFF":
        return staffMenuItems;
      case "DOCTOR":
        return doctorMenuItems;
      default:
        return [];
    }
  };

  const renderDefaultHeader = () => (
    <div className="hidden md:flex items-center space-x-8">
      <nav className="flex space-x-8">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => router.push("/registrations")}
        className="px-4 py-1.5 bg-blue-600 text-white rounded text-base hover:bg-blue-700 transition"
      >
        Đăng Ký Khám
      </button>
      <button
        onClick={() => router.push("/login")}
        className="px-4 py-1.5 bg-sky-300 text-white rounded text-base hover:bg-sky-400 transition"
      >
        Login
      </button>
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
      <div className="w-full px-4 py-4 md:px-8 md:py-6 flex justify-between items-center">
        <Link href="/home" className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
          <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
            HIV Treatment and Medical
          </h1>
        </Link>

        {isLoggedIn ? (
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[#27509f] font-roboto text-base font-medium hover:underline"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border hover:ring-2 hover:ring-blue-400 transition"
              >
                <img
                  src={
                    avatarUrl
                      ? `http://localhost:8080${avatarUrl}`
                      : "/avatar-default.png"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg z-50 p-2"
                  onClick={handleProfileMenuContainerClick}
                >
                  <ul className="space-y-1">
                    {getProfileMenuItems().map((item) => (
                      <li key={item.href}>
                        <button
                          onClick={() => handleProfileMenuLinkClick(item.href)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          renderDefaultHeader()
        )}

        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
