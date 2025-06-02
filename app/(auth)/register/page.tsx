"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState(""); // Thêm state cho Gender
  const [dateOfBirth, setDateOfBirth] = useState(""); // Thêm state cho DateOfBirth
  const [phone, setPhone] = useState(""); // Thay đổi contact thành phone và email riêng
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!fullname || !gender || !dateOfBirth || !phone || !email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    const payload = {
      fullName: fullname,
      gender: gender, // Gửi giá trị string của enum Gender (MALE, FEMALE, OTHER)
      dateOfBirth: dateOfBirth, // Gửi dạng YYYY-MM-DD
      phone: phone,
      email: email,
      password: password,
      // Role sẽ được gán cứng là CUSTOMER ở backend
    };

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          setError(errData.message || "Đăng ký thất bại.");
        } else {
          const errText = await res.text();
          setError(errText || "Đăng ký thất bại: Lỗi không xác định từ máy chủ.");
        }
        return;
      }

      const result = await res.json();
      alert("Đăng ký thành công!");
      console.log("Đăng ký thành công:", result);
      window.location.href = "/login"; // Chuyển hướng sang trang login
    } catch (err) {
      setError("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
      console.error("Lỗi khi đăng ký:", err);
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
            <select
              id="gender"
              name="gender"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="tel" // Use type="tel" for phone numbers
              id="phone"
              name="phone"
              required
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="email" // Use type="email" for email
              id="email"
              name="email"
              required
              placeholder="Nhập địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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