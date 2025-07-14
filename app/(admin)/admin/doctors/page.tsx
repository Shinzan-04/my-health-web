"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ApiService from "@/app/service/ApiService";
import EditDoctorModal from "./EditDoctorModal";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchDoctors = async () => {
    try {
      const data = await ApiService.getAllDoctors();
      setDoctors(data);
    } catch {
      toast.error("Không thể lấy danh sách bác sĩ", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctorId(doctor.doctorId);
    setEditFormData({ ...doctor });
  };

  const promptDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId == null) return;
    try {
      await ApiService.deleteDoctor(confirmDeleteId);
      toast.success("Xóa bác sĩ thành công", {
        style: { background: "#f0fdf4", color: "#166534" },
      });
      fetchDoctors();
    } catch {
      toast.error("Lỗi khi xóa bác sĩ", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  // Filter + Pagination
  const filtered = doctors.filter((d) =>
    d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 py-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 sm:p-10 space-y-8 border border-blue-100">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold italic text-blue-900 font-sans mb-2 tracking-tight drop-shadow-md">
            Quản lý bác sĩ
          </h1>
          <p className="text-gray-500 text-sm">Xem, chỉnh sửa và quản lý thông tin bác sĩ</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, chuyên môn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          <span className="text-gray-600 text-sm mt-2 md:mt-0">
            Tổng: {filtered.length} bác sĩ
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-blue-100">
          <table className="min-w-full text-base text-gray-700">
            <thead className="bg-blue-100 text-blue-900 uppercase tracking-wider text-sm">
              <tr>
                <th className="border border-blue-200 px-4 py-3 text-left">ID</th>
                <th className="border border-blue-200 px-4 py-3 text-left">Họ tên</th>
                <th className="border border-blue-200 px-4 py-3 text-left">Email</th>
                <th className="border border-blue-200 px-4 py-3 text-left">SĐT</th>
                <th className="border border-blue-200 px-4 py-3 text-left">Chuyên môn</th>
                <th className="border border-blue-200 px-4 py-3 text-left">Kinh nghiệm</th>
                <th className="border border-blue-200 px-4 py-3 text-left">Mô tả</th>
                <th className="border border-blue-200 px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                paginated.map((doctor, idx) => (
                  <tr
                    key={doctor.doctorId}
                    className={`${idx % 2 === 0 ? "bg-blue-50" : "bg-white"} hover:bg-blue-100 transition`}
                  >
                    <td className="border border-blue-200 px-4 py-3">{doctor.doctorId}</td>
                    <td className="border border-blue-200 px-4 py-3">{doctor.fullName}</td>
                    <td className="border border-blue-200 px-4 py-3">{doctor.email}</td>
                    <td className="border border-blue-200 px-4 py-3">{doctor.phone}</td>
                    <td className="border border-blue-200 px-4 py-3">{doctor.specialization}</td>
                    <td className="border border-blue-200 px-4 py-3">{doctor.workExperienceYears}</td>
                    <td className="border border-blue-200 px-4 py-3 break-words max-w-[300px] whitespace-pre-line">
                      {doctor.description}
                    </td>
                    <td className="border border-blue-200 px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          onClick={() => handleEdit(doctor)}
                        >
                          Sửa
                        </button>
                        <button
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          onClick={() => promptDelete(doctor.doctorId)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>
            Trang {currentPage} / {totalPages} ({filtered.length} bác sĩ)
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              ← Trước
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              Sau →
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        <EditDoctorModal
          isOpen={editingDoctorId !== null}
          doctor={editFormData}
          onClose={() => setEditingDoctorId(null)}
          onSave={async (data) => {
            if (!editingDoctorId) return;
            try {
              await ApiService.updateDoctorNoAvatar(editingDoctorId, data);
              toast.success("Cập nhật thành công!", {
                icon: "🎉",
                style: { borderRadius: "8px", background: "#f0fdf4", color: "#16a34a" },
              });
              setEditingDoctorId(null);
              fetchDoctors();
            } catch {
              toast.error("Lỗi khi cập nhật bác sĩ", {
                style: { background: "#fef2f2", color: "#b91c1c" },
              });
            }
          }}
        />

        {/* Confirm Delete Modal */}
        {confirmDeleteId !== null &&
          createPortal(
            <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50 ">
              <div className="bg-white rounded-lg shadow-lg w-80 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Xác nhận xóa</h2>
                <p className="mb-6 text-gray-700">Bạn có chắc chắn muốn xóa bác sĩ này?</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 rounded border hover:bg-gray-100 text-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
