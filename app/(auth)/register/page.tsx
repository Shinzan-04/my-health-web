
"use client";

import { useState } from "react";
import ApiService from "@/app/service/ApiService";


export default function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!fullname.trim().includes(" ")) {
      setError("Vui lòng nhập đầy đủ họ và tên.");
      return false;
    }

    if (!gender) {
      setError("Vui lòng chọn giới tính.");
      return false;
    }

    if (!/^[0-9]{9,11}$/.test(phone)) {
      setError("Số điện thoại không hợp lệ. Chỉ gồm 9-11 chữ số.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return false;
    }

    if (password.length < 6 ) {
      setError("Mật khẩu phải tối thiểu 6 ký tự, gồm chữ và số.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const payload = {
      fullName: fullname,
      gender,
      phone,
      email,
      password,
      role: "USER",
    };

    try {
      const result = await ApiService.registerUser(payload);
      console.log("Đăng ký thành công:", result);
      setSuccessMessage("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      const message = err?.response?.data?.message || "Đăng ký thất bại.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-xl rounded-xl px-8 py-10 w-full max-w-md relative">
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-2 shadow">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Đăng ký tài khoản</h2>
          <div className="text-gray-800 text-sm mb-2">Thông tin của bạn được bảo mật tuyệt đối</div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Họ và tên" value={fullname} onChange={(e) => setFullname(e.target.value)} className="input-custom-text"required />
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-custom-text" required>
            <option value="">Chọn giới tính</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
          <input type="tel" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-custom-text" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-custom-text" required />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} className="input-custom-text" required />
          <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-custom-text" required />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition" disabled={isLoading}>
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          {successMessage && <div className="text-green-600 text-center text-sm">{successMessage}</div>}
        </form>

        <div className="mt-6 text-center text-sm text-gray-800">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
