"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ApiService from "../../../service/ApiService";
import { useRouter } from "next/navigation";

type AdminForm = {
  fullName: string;
  phone: string;
  email: string;
};

export default function AdminEditPage() {
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminForm>();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await ApiService.getMyAdminProfile(); // Bạn cần định nghĩa API này
        if (res) {
          reset({
            fullName: res.fullName,
            phone: res.phone,
            email: res.email,
          });
          setAdminId(res.adminId);
        }
      } catch (err) {
        console.error("Lỗi khi tải hồ sơ admin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: AdminForm) => {
    if (!adminId) return;

    try {
      await ApiService.updateAdmin(adminId, data);
      alert("Cập nhật thành công!");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Cập nhật thất bại.");
    }
  };

  if (loading) return <p>Đang tải hồ sơ...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Chỉnh sửa hồ sơ quản trị viên</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Họ và tên</label>
          <input
            {...register("fullName", { required: "Không được để trống" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Số điện thoại</label>
          <input
            {...register("phone", { required: "Không được để trống" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email", { required: "Không được để trống" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            type="email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}
