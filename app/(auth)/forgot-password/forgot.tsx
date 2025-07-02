"use client";

import { useState } from "react";
import Link from "next/link";
import ApiService from "@/app/service/ApiService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");
  setError("");

  if (!email) {
    setError("Vui lòng nhập email của bạn.");
    return;
  }

  try {
    await ApiService.forgotPassword({ email });
    setMessage("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email.");
  } catch (err: any) {
    console.error("Lỗi gửi yêu cầu:", err);
    setError(err?.response?.data?.message || "Đã xảy ra lỗi.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-600 text-white text-3xl rounded-full shadow">
            📧
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mt-3">Quên mật khẩu</h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Gửi yêu cầu
          </button>

          {message && <div className="text-center text-green-600 text-sm">{message}</div>}
          {error && <div className="text-center text-red-600 text-sm">{error}</div>}
        </form>

        <div className="mt-6 flex flex-col text-gray-800 items-center gap-2 text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}