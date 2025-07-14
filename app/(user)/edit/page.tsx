"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApiService from "@/app/service/ApiService";
import toast, { Toaster } from "react-hot-toast";
import React from "react";

export default function EditCustomerProfile() {
  const [customer, setCustomer] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("authData");
    if (!raw) {
      toast.error("Vui lòng đăng nhập lại.");
      router.push("/login");
      return;
    }

    try {
      const authData = JSON.parse(raw);
      const token = authData.token;
      if (!token) throw new Error("Token không hợp lệ.");

      setToken(token);

      ApiService.getMyCustomerProfile()
        .then((data) => {
          setCustomer(data);
          setCustomerId(data.customerID || data.customerId || data.id);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Không thể tải hồ sơ khách hàng.");
          router.push("/login");
        });
    } catch (err) {
      console.error("Lỗi khi đọc token:", err);
      router.push("/login");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (customer) {
      setCustomer({ ...customer, [e.target.name]: e.target.value });
    }
  };

  const validateCustomerForm = (customer: any) => {
    const errors: any = {};

    if (!customer.fullName || customer.fullName.trim().length < 2) {
      errors.fullName = "Vui lòng nhập họ tên hợp lệ";
    }

    if (!customer.phone) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(customer.phone)) {
      errors.phone = "Số điện thoại không hợp lệ. Chỉ gồm 9-11 chữ số.";
    }

    if (!customer.address || customer.address.trim().length < 2) {
      errors.address = "Vui lòng nhập địa chỉ";
    }

    const dob = customer.dob || customer.dateOfBirth;
    if (!dob) {
      errors.dob = "Vui lòng nhập ngày sinh";
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 16) {
        errors.dob = "Bạn phải đủ 16 tuổi trở lên";
      }
    }

    if (!customer.gender) {
      errors.gender = "Vui lòng chọn giới tính";
    }

    if (customer.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(customer.email)) {
      errors.email = "Email không hợp lệ";
    }

    return errors;
  };

  // Tạo component FormField tái sử dụng
  const FormField = ({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
  }: {
    label: string;
    name: string;
    value: any;
    onChange: any;
    error?: string;
    type?: string;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        className={`w-full border px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${error ? "border-red-400" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const handleSubmit = async () => {
    if (!customer || !customerId || !token) return;

    const validationErrors = validateCustomerForm(customer);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Vui lòng sửa các lỗi trong biểu mẫu trước khi tiếp tục.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      const customerBlob = new Blob([JSON.stringify(customer)], {
        type: "application/json",
      });
      formData.append("customer", customerBlob);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await ApiService.updateCustomerProfile(customerId, formData, token);

      toast.success("Cập nhật thành công!");
      router.replace("/edit"); // ✅ chuyển hướng thay vì reload, tránh lỗi 404 và giữ SPA
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật.");
    } finally {
      setSubmitting(false);
    }
    window.location.reload();
  };

  if (loading || !customer)
    return (
      <div className="mt-32 text-center text-gray-700">Đang tải hồ sơ...</div>
    );

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-blue-100 py-16 px-6 sm:px-8 flex justify-center items-center">

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 sm:p-10 space-y-8 border border-blue-100">
          <div className="text-center space-y-2">
            <div className="relative inline-block group">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : customer.avatarUrl
                      ? `http://localhost:8080${customer.avatarUrl}`
                      : "/avatar-default.png"
                }
                alt="Avatar"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-200 shadow-md transition-transform duration-300 group-hover:scale-105 bg-white"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src !== window.location.origin + "/avatar-default.png") {
                    img.onerror = null; // Ngăn lặp vô hạn
                    img.src = "/avatar-default.png";
                  }
                }}
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-blue-700 transition">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 20h9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarFile(file);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
            <h2 className="text-3xl font-bold text-blue-800 tracking-wide">
              Chỉnh sửa hồ sơ cá nhân
            </h2>
            <p className="text-gray-500 text-sm">
              Cập nhật thông tin để trải nghiệm tốt hơn
            </p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={customer.email ?? ""}
                readOnly
                disabled
                className="w-full border border-gray-200 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-gray-500"
              />
            </div>
            {/* Họ tên */}
            <FormField
              label="Họ tên"
              name="fullName"
              value={customer.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            {/* Địa chỉ */}
            <FormField
              label="Địa chỉ"
              name="address"
              value={customer.address}
              onChange={handleChange}
              error={errors.address}
            />
            {/* Số điện thoại */}
            <FormField
              label="Số điện thoại"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            {/* Ngày sinh */}
            <FormField
              type="date"
              label="Ngày sinh"
              name="dateOfBirth"
              value={customer.dateOfBirth}
              onChange={handleChange}
              error={errors.dob}
            />
            {/* Giới tính */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={customer.gender ?? ""}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.gender ? "border-red-400" : "border-gray-300"
                  }`}
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition text-lg flex items-center justify-center ${submitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            {submitting ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8v4a4 4 0 004 4h4a8 8 0 01-8 8z"
                />
              </svg>
            ) : null}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
}