"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ApiService from "@/app/service/ApiService"; // Đường dẫn đúng tùy project

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Liên kết không hợp lệ hoặc đã hết hạn.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!token) {
      setError("Token không hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      await ApiService.resetPassword({
        token,
        newPassword: password,
      });

      setMessage("✅ Mật khẩu đã được thay đổi thành công. Đang chuyển hướng...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      console.error("Lỗi:", err);
      setError(err?.response?.data?.message || "Không thể đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-600 text-white text-3xl rounded-full shadow">
            🔑
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mt-3">Đặt lại mật khẩu</h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>

          {message && <div className="text-center text-green-600 text-sm">{message}</div>}
          {error && <div className="text-center text-red-600 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
}
