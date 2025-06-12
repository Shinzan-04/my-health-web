"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function UserProfileView() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0901234567",
    address: "Hà Nội",
    dob: "1990-01-01",
    gender: "male",
  });
  const [errors, setErrors] = useState<any>({});

  const user = form;
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
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
            <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
              HIV Treatment and Medical
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Search bar on the left */}
            <form
              className="flex items-center border rounded px-2 py-1 bg-gray-50 mr-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              style={{ minWidth: 200 }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="outline-none bg-transparent text-sm px-2"
                disabled
              />
              <button
                type="submit"
                className="text-[#27509f] font-bold px-2"
                disabled
              >
                🔍
              </button>
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

            {/* Avatar + Profile Menu */}
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

      <div className="max-w-2xl mx-auto mt-32 bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-[#27509f] text-center">
          Hồ sơ cá nhân
        </h2>
        {successMsg && (
          <div className="mb-4 text-green-600 text-center font-medium">
            {successMsg}
          </div>
        )}
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Validate
              const newErrors: any = {};
              if (!form.name) newErrors.name = "Vui lòng nhập họ tên";
              if (!form.email) newErrors.email = "Vui lòng nhập email";
              if (!form.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
              if (!form.dob) newErrors.dob = "Vui lòng nhập ngày sinh";
              setErrors(newErrors);
              if (Object.keys(newErrors).length > 0) return;
              setIsEditing(false);
              setSuccessMsg("Cập nhật hồ sơ thành công!");
              setTimeout(() => setSuccessMsg(""), 2500);
            }}
            className="space-y-4"
          >
            <div className="flex items-center mb-2">
              <label className="w-1/3 font-medium">Họ và tên</label>
              <input
                className="flex-1 border rounded px-3 py-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            {errors.name && (
              <div className="text-red-500 text-sm mb-2 ml-1/3">
                {errors.name}
              </div>
            )}
            <div className="flex items-center mb-2">
              <label className="w-1/3 font-medium">Email</label>
              <input
                className="flex-1 border rounded px-3 py-2"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                type="email"
              />
            </div>
            {errors.email && (
              <div className="text-red-500 text-sm mb-2 ml-1/3">
                {errors.email}
              </div>
            )}
            <div className="flex items-center mb-2">
              <label className="w-1/3 font-medium">Số điện thoại</label>
              <input
                className="flex-1 border rounded px-3 py-2"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                type="tel"
              />
            </div>
            {errors.phone && (
              <div className="text-red-500 text-sm mb-2 ml-1/3">
                {errors.phone}
              </div>
            )}
            <div className="flex items-center mb-2">
              <label className="w-1/3 font-medium">Địa chỉ</label>
              <input
                className="flex-1 border rounded px-3 py-2"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div className="flex items-center mb-2">
              <label className="w-1/3 font-medium">Ngày sinh</label>
              <input
                className="flex-1 border rounded px-3 py-2"
                value={form.dob}
                onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                type="date"
              />
            </div>
            {errors.dob && (
              <div className="text-red-500 text-sm mb-2 ml-1/3">
                {errors.dob}
              </div>
            )}
            <div className="flex items-center mb-2">
              <label className="w-1/3 font-medium">Giới tính</label>
              <select
                className="flex-1 border rounded px-3 py-2"
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#27509f] text-white font-semibold"
              >
                Lưu
              </button>
            </div>
          </form>
        ) : (
          <>
            <table className="w-full border text-base">
              <tbody>
                <tr>
                  <td className="py-2 px-3 border font-medium w-1/3">Họ và tên</td>
                  <td className="py-2 px-3 border">{user.name}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border font-medium">Email</td>
                  <td className="py-2 px-3 border">{user.email}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border font-medium">Số điện thoại</td>
                  <td className="py-2 px-3 border">{user.phone}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border font-medium">Địa chỉ</td>
                  <td className="py-2 px-3 border">{user.address}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border font-medium">Ngày sinh</td>
                  <td className="py-2 px-3 border">{user.dob}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border font-medium">Giới tính</td>
                  <td className="py-2 px-3 border">
                    {user.gender === "male"
                      ? "Nam"
                      : user.gender === "female"
                      ? "Nữ"
                      : user.gender === "other"
                      ? "Khác"
                      : ""}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 rounded bg-[#27509f] text-white font-semibold"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
