"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

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
    { label: "Danh sách bệnh nhân điều trị", href: "/doctor/patients" },
    { label: "Xem hồ sơ bệnh nhân", href: "/doctor/records" },
    { label: "Nhắc nhở uống thuốc", href: "/doctor/reminders" },
    { label: "Cập nhật phác đồ điều trị", href: "/doctor/treatment-plan" },
    { label: "Lịch làm việc", href: "/doctor/schedule" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role || "");
    }
  }, []);

  const handleProfileMenuLinkClick = (href: string) => {
    window.location.href = href;
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleProfileMenuContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getProfileMenuItems = () => {
    if (userRole === "USER") return userMenuItems;
    if (userRole === "STAFF") return staffMenuItems;
    if (userRole === "DOCTOR") return doctorMenuItems;
    return [];
  };

  if (isLoggedIn && ["USER", "STAFF", "DOCTOR"].includes(userRole)) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50 text-[17px]">
        <div className="w-full px-4 py-4 md:px-8 md:py-6 flex justify-between items-center">
          <a href="/home" className="flex items-center space-x-2 md:space-x-3">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-[80px] md:w-[100px] h-auto rounded-md"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/100xauto/E0E0E0/666666?text=Logo";
              }}
            />
            <h1 className="font-roboto text-[16px] md:text-[20px] text-[#879FC5EB] m-0">
              HIV Treatment and Medical
            </h1>
          </a>

          <div className="hidden md:flex items-center space-x-6 md:space-x-8">
            <nav className="flex space-x-6 md:space-x-8">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-[#27509f] font-roboto text-base font-medium no-underline hover:underline transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="relative profile-menu-container">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="avatar-button w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="User profile menu"
              >
                <img
                  src="https://placehold.co/40x40/CCCCCC/333333?text=Avatar"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/40x40/E0E0E0/666666?text=User";
                  }}
                />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 transform origin-top-right animate-fade-in"
                  onClick={handleProfileMenuContainerClick}
                >
                  <ul className="profile-menu space-y-1">
                    {getProfileMenuItems().map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleProfileMenuLinkClick(item.href);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
    );
  }

  // Header mặc định khi chưa login
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
      <div className="w-full px-8 py-6 flex justify-between items-center">
        <Link href="/home" className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
          <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
            HIV Treatment and Medical
          </h1>
        </Link>

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
            onClick={() => (window.location.href = "/registrations")}
            className="px-4 py-1.5 bg-blue-600 text-white rounded cursor-pointer text-base hover:bg-blue-700 transition"
          >
            Đăng Ký Khám
          </button>

          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-1.5 bg-sky-300 text-white rounded cursor-pointer text-base hover:bg-sky-400 transition"
          >
            Login
          </button>
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 pb-6 space-y-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="block text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
            >
              {label}
            </Link>
          ))}
          <div className="flex space-x-4 pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                window.location.href = "/registrations";
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer text-base hover:bg-blue-700 transition"
            >
              Đăng Ký Khám
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                window.location.href = "/login";
              }}
              className="flex-1 px-4 py-2 bg-sky-300 text-white rounded cursor-pointer text-base hover:bg-sky-400 transition"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
