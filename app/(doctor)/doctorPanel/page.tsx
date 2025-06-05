"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function userPannel() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { label: "Trang Chủ", href: "/home" },
    { label: "Liên Hệ", href: "/contact" },
    { label: "BlogBlog", href: "/blog" },
  ];

  const profileMenuItems = [
    { label: "Danh sách bệnh nhân điều trị", id: "patient-list" },
    { label: "Xem hồ sơ bệnh nhân", id: "patient-profile" },
    { label: "• CD Tải lượng HIV", id: "cd-hiv" },
    { label: "• Nhắc nhở uống thuốc", id: "med-reminders" },
    { label: "Chọn/cập nhật phác đồ điều trị", id: "treatment-plan" },
    { label: "Lịch tư vấn online", id: "online-consultation" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
      <div className="w-full px-8 py-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/home" className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
          <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
            HIV Treatment and Medical
          </h1>
        </Link>

        {/* Desktop Nav */}
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

          {/* Avatar + Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
            >
              <img
                src="/img/user1.jpg"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-2">
                <ul className="profile-menu space-y-1">
                  {profileMenuItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href="#"
                        data-content-id={item.id}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <hr className="my-2" />
                <button
                  onClick={() => alert("Đăng xuất")}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
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

          {/* Avatar Mobile Menu */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="/avatar.jpg"
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="font-medium text-gray-800">Tài Khoản</span>
            </div>
            <ul className="profile-menu space-y-1">
              {profileMenuItems.map((item) => (
                <li key={item.id}>
                  <a
                    href="#"
                    data-content-id={item.id}
                    className="block text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <hr className="my-3" />
            <button
              onClick={() => alert("Đăng xuất")}
              className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
