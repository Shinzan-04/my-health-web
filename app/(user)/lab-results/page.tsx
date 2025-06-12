"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function LabResults() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Giả lập dữ liệu kết quả xét nghiệm
  const labResults = [
    {
      id: 1,
      date: "2024-12-01",
      test: "HIV Viral Load",
      result: "Không phát hiện virus",
      note: "Kết quả tốt, tiếp tục điều trị."
    },
    {
      id: 2,
      date: "2024-09-15",
      test: "CD4 Count",
      result: "550 cells/mm³",
      note: "Chỉ số ổn định."
    },
    {
      id: 3,
      date: "2024-06-10",
      test: "Xét nghiệm máu tổng quát",
      result: "Bình thường",
      note: "Không phát hiện bất thường."
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
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
        <div className="w-full px-8 py-6 flex justify-between items-center">
          <Link href="/home" className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
            <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
              HIV Treatment and Medical
            </h1>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <form
              className="flex items-center border rounded px-2 py-1 bg-gray-50 mr-4"
              onSubmit={e => e.preventDefault()}
              style={{ minWidth: 200 }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="outline-none bg-transparent text-sm px-2"
              />
              <button type="submit" className="text-[#27509f] font-bold px-2">🔍</button>
            </form>
            <nav className="flex space-x-8 items-center">
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
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
              >
                <img
                  src="/avatar.jpg"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg z-50 p-2">
                  <ul className="profile-menu space-y-1">
                    {profileMenuItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href="#"
                          data-content-id={item.id}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => handleProfileMenuClick(item.id)}
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
                      onClick={() => handleProfileMenuClick(item.id)}
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
      <div className="max-w-7xl mx-auto mt-10 bg-white p-8 rounded shadow">
        <h2 className="text-4xl font-bold mb-6 text-[#27509f] text-center">Kết quả xét nghiệm</h2>
        <table className="w-full border text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border">Ngày</th>
              <th className="py-2 px-3 border">Loại xét nghiệm</th>
              <th className="py-2 px-3 border">Kết quả</th>
              <th className="py-2 px-3 border">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {labResults.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50">
                <td className="py-2 px-3 border">{item.date}</td>
                <td className="py-2 px-3 border">{item.test}</td>
                <td className="py-2 px-3 border">{item.result}</td>
                <td className="py-2 px-3 border">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
