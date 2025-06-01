"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Trang Chủ", href: "/home" },
    { label: "Bác Sĩ", href: "/doctor" },
    { label: "Đặt Lịch", href: "/booking" },
    { label: "Liên Hệ", href: "/contact" },
    { label: "Đăng nhập", href: "/login" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
      <div className="w-full px-8 py-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/home" className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
          <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
            HIV Treatment and Medical
          </h1>
        </Link>

        {/* Menu + Buttons grouped together on desktop */}
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
            onClick={() => window.location.href = "/registrations"}
            className="px-4 py-1.5 bg-blue-600 text-white rounded cursor-pointer text-base hover:bg-blue-700 transition"
          >
            Đăng Ký Khám
          </button>

          <button
            onClick={() => window.location.href = "/login"}
            className="px-4 py-1.5 bg-sky-300 text-white rounded cursor-pointer text-base hover:bg-sky-400 transition"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Toggle */}
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
