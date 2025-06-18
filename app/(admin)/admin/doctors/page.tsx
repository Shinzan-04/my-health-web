"use client";

import { useEffect, useState } from "react";
import ApiService from "../../../service/ApiService";
import EditDoctorModal from "./EditDoctorModal";
import toast from "react-hot-toast";
import { FilePen, Trash } from "lucide-react";

type Doctor = {
  doctorId: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  description: string;
  workExperienceYears: number;
};

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Doctor>>({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await ApiService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", err);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctorId(doctor.doctorId);
    setEditFormData({ ...doctor });
  };

  const handleDelete = async (doctorId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bác sĩ này?")) return;
    try {
      await ApiService.deleteDoctor(doctorId);
      toast.success("Xóa bác sĩ thành công");
      fetchDoctors();
    } catch (err) {
      toast.error("Lỗi khi xóa bác sĩ");
    }
  };

  const handleModalSave = async (data: any) => {
    if (!editingDoctorId) return;
    try {
      await ApiService.updateDoctorNoAvatar(editingDoctorId, data);
      toast.success("Cập nhật thành công!", {
  icon: "🎉",
  style: {
    borderRadius: "8px",
    background: "#f0fdf4",
    color: "#16a34a",
  },
});

      setEditingDoctorId(null);
      fetchDoctors();
    } catch (err) {
      toast.error("Lỗi khi cập nhật bác sĩ");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Quản lý bác sĩ</h1>

      <div className="overflow-x-auto rounded border border-gray-400 shadow-sm bg-white">
        <table className="min-w-full text-sm text-gray-900">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border border-gray-400 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Họ tên</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-400 px-4 py-2 text-left">SĐT</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Chuyên môn</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Số năm kinh nghiệm</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Mô tả</th>
              <th className="border border-gray-400 px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.doctorId} className="hover:bg-gray-100">
                <td className="border border-gray-400 px-4 py-2">{doctor.doctorId}</td>
                <td className="border border-gray-400 px-4 py-2">{doctor.fullName}</td>
                <td className="border border-gray-400 px-4 py-2">{doctor.email}</td>
                <td className="border border-gray-400 px-4 py-2">{doctor.phone}</td>
                <td className="border border-gray-400 px-4 py-2">{doctor.specialization}</td>
                <td className="border border-gray-400 px-4 py-2">{doctor.workExperienceYears}</td>
                <td className="border border-gray-400 px-4 py-2">{doctor.description}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transform transition-transform hover:scale-105"
                      onClick={() => handleEdit(doctor)}
                    >
                      <FilePen size={16} />
                      Sửa
                    </button>
                    <button
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transform transition-transform hover:scale-105"
                      onClick={() => handleDelete(doctor.doctorId)}
                    >
                      <Trash size={16} />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditDoctorModal
        isOpen={editingDoctorId !== null}
        doctor={editFormData}
        onClose={() => setEditingDoctorId(null)}
        onSave={handleModalSave}
      />
    </div>
  );
}
