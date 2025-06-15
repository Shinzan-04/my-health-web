"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApiService from "@/app/service/ApiService";

export default function EditDoctorProfile() {
  const [doctor, setDoctor] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("authData");
    if (!raw) {
      alert("Vui lòng đăng nhập lại.");
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
          alert("Không thể tải hồ sơ bác sĩ.");
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
    }
  };

  const handleSubmit = async () => {
    if (!doctor || !doctorId || !token) return;

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

      alert("Cập nhật thành công!");
      router.push("/doctorPanel");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật.");
    }
  };

  if (loading || !doctor)
    return (
      <div className="mt-32 text-center text-gray-700">Đang tải hồ sơ...</div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Chỉnh sửa hồ sơ bác sĩ
        </h2>
        {doctor.avatarUrl && (
          <div className="flex justify-center mb-6">
            <img
              src={`http://localhost:8080${doctor.avatarUrl}`}
              alt="Avatar bác sĩ"
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/avatar-default.png";
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Họ tên:
            </label>
            <input
              name="fullName"
              value={doctor.fullName ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Tải ảnh đại diện:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatarFile(file);
              }}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
