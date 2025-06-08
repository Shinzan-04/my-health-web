"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          setError(errData.message || "Đăng nhập thất bại.");
        } else {
          const errText = await res.text();
          setError(errText || "Đăng nhập thất bại: Lỗi không xác định từ máy chủ.");
        }
        return;
      }

      const result = await res.json();
      console.log("Đăng nhập thành công:", result);

      // --- THAY ĐỔI QUAN TRỌNG TẠI ĐÂY ---
      // Lưu toàn bộ đối tượng result vào một mục 'authData' duy nhất trong localStorage
      localStorage.setItem("authData", JSON.stringify(result));
      // --- KẾT THÚC THAY ĐỔI ---

      // Chuyển hướng dựa trên vai trò
      switch (result.role) {
        case "CUSTOMER":
          window.location.href = "/customer/dashboard"; // Hoặc giao diện bệnh nhân
          break;
        case "DOCTOR":
          window.location.href = "/doctorPanel"; // Giao diện bác sĩ
          break;
        case "ADMIN":
          window.location.href = "/admin/dashboard"; // Giao diện quản trị viên
          break;
        case "STAFF":
          window.location.href = "/staff/dashboard"; // Giao diện lễ tân
          break;
        case "USER": // Nếu USER là một vai trò độc lập không phải Customer
          window.location.href = "/userPanel";
          break;
        default:
          window.location.href = "/"; // Trang mặc định nếu không khớp
          break;
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
      console.error("Lỗi khi đăng nhập:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        {/* Icon + Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-600 text-white text-3xl rounded-full shadow">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mt-3">Đăng nhập</h2>
          <p className="text-gray-500 text-sm mt-1">
            Thông tin đăng nhập của bạn được bảo mật
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email hoặc số điện thoại" // Để người dùng có thể nhập cả email hoặc sđt
            value={email} // Sẽ là trường hợp email trong DTO LoginRequest
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>

          {error && (
            <div className="text-center text-sm text-red-600">{error}</div>
          )}
        </form>

        {/* Links */}
        <div className="mt-6 flex flex-col text-gray-800 items-center gap-2 text-sm">
          <p>
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}