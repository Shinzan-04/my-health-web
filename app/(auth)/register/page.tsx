"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!fullname || !contact || !password || !confirmPassword) {
    setError("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  if (password !== confirmPassword) {
    setError("Mật khẩu xác nhận không khớp");
    return;
  }

  const payload = {
    fullName: fullname,
    password: password,
    email: contact.includes("@") ? contact : null,
    phone: contact.includes("@") ? null : contact,
    gender: "MALE", // hoặc cho người dùng chọn
    role: "CUSTOMER" // hoặc "ADMIN" tùy form
  };

  try {
    const res = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      setError(errData.message || "Đăng ký thất bại");
      return;
    }

    const result = await res.json();
    alert("Đăng ký thành công!");
    console.log(result);
    // Chuyển hướng sang trang login:
    window.location.href = "/login";

  } catch (err) {
    setError("Lỗi kết nối máy chủ");
    console.error(err);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-xl rounded-xl px-8 py-10 w-full max-w-md relative">
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-2 shadow">
            <span>🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Đăng ký tài khoản</h2>
          <div className="text-gray-500 text-sm mb-2">Thông tin của bạn được bảo mật tuyệt đối</div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="fullname"
              name="fullname"
              required
              placeholder="Nhập họ và tên"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="text"
              id="contact"
              name="contact"
              required
              placeholder="Nhập email hoặc số điện thoại"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              placeholder="Xác nhận lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Đăng ký
          </button>
          {error && (
            <div className="text-red-600 text-center text-sm">{error}</div>
          )}
        </form>
        <div className="mt-6 flex flex-col text-gray-800 items-center gap-2">
          <span className="text-sm">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Đăng nhập
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}