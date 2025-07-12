"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApiService from "@/app/service/ApiService";
import toast, { Toaster } from "react-hot-toast";

export default function EditDoctorProfile() {
  const [doctor, setDoctor] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

      ApiService.getMyDoctorProfile()
        .then((data) => {
          setDoctor(data);
          setDoctorId(data.doctorId);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Không thể tải hồ sơ bác sĩ.");
          router.push("/login");
        });
    } catch (err) {
      console.error("Lỗi khi đọc token:", err);
      router.push("/login");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (doctor) {
      setDoctor({ ...doctor, [e.target.name]: e.target.value });
      setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // Xoá lỗi khi người dùng sửa
    }
  };

  // Validation form
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!doctor.fullName || doctor.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (doctor.phone && !/^\d{9,11}$/.test(doctor.phone)) {
      newErrors.phone = "Số điện thoại phải gồm 9-11 chữ số";
    }

    if (doctor.workExperienceYears !== undefined) {
      const years = Number(doctor.workExperienceYears);
      if (isNaN(years) || years < 0) {
        newErrors.workExperienceYears = "Số năm kinh nghiệm phải là số dương";
      }
    }

    // Có thể thêm validate các trường khác nếu cần

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!doctor || !doctorId || !token) return;

    if (!validate()) {
      toast.error("Vui lòng sửa lỗi trong biểu mẫu trước khi lưu");
      return;
    }

    try {
      const formData = new FormData();
      const doctorBlob = new Blob([JSON.stringify(doctor)], {
        type: "application/json",
      });
      formData.append("doctor", doctorBlob);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await ApiService.updateDoctorWithAvatar(doctorId, formData, token);

      toast.success("Cập nhật thành công!");
      router.push("/doctorPanel");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật.");
    }
    window.location.reload();
  };

  if (loading || !doctor)
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
                    : doctor.avatarUrl
                    ? `http://localhost:8080${doctor.avatarUrl}`
                    : "/avatar-default.png"
                }
                alt="Avatar"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-200 shadow-md transition-transform duration-300 group-hover:scale-105 bg-white"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src !== window.location.origin + "/avatar-default.png") {
                    img.onerror = null;
                    img.src = "/avatar-default.png";
                  }
                }}
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-blue-700 transition">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              Chỉnh sửa hồ sơ bác sĩ
            </h2>
            <p className="text-gray-500 text-sm">
              Cập nhật thông tin để cung cấp dịch vụ tốt hơn
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Email:
            </label>
            <input
              type="email"
              value={doctor.email ?? ""}
              readOnly
              disabled
              className="w-full border border-gray-200 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-gray-500"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Họ tên:
              </label>
              <input
                name="fullName"
                value={doctor.fullName ?? ""}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Chuyên khoa:
              </label>
              <input
                name="specialization"
                value={doctor.specialization ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Số điện thoại:
              </label>
              <input
                name="phone"
                value={doctor.phone ?? ""}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Mô tả:
              </label>
              <textarea
                name="description"
                value={doctor.description ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Số năm kinh nghiệm:
              </label>
              <input
                name="workExperienceYears"
                type="number"
                value={doctor.workExperienceYears ?? 0}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.workExperienceYears ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.workExperienceYears && (
                <p className="text-red-600 text-sm mt-1">{errors.workExperienceYears}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition text-lg flex items-center justify-center"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
}
