"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

type ARVRegimen = {
  arvRegimenId: number;
  doctorName: string;
  customerName: string;
  createDate: string;
  endDate: string;
  regimenCode: string;
  regimenName: string;
  medicationSchedule: string;
  description: string;
};

export default function ARVPage() {
  const [arvRegimens, setArvRegimens] = useState<ARVRegimen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMyARV = async () => {
      try {
        const data = await ApiService.getMyARVRegimens();
        setArvRegimens(data);
      } catch (err) {
        console.error("Lỗi khi lấy ARV:", err);
        toast.error("Lỗi khi tải phác đồ ARV.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyARV();
  }, []);

  const filtered = arvRegimens.filter(
    (item) =>
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.regimenName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 space-y-6">
        {/* Tiêu đề và thanh tìm kiếm cùng hàng giống MedicalHistoryTable */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-blue-800">Phác đồ ARV của bạn</h2>
          <input
            type="text"
            placeholder="🔍 Tìm theo tên bệnh nhân, bác sĩ hoặc phác đồ..."
            className="border px-3 py-2 rounded w-full md:w-96 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded border border-gray-300 shadow bg-white">
          <table className="min-w-[1200px] w-full text-sm text-gray-900">
            <thead className="bg-white border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Bệnh nhân</th>
                <th className="px-4 py-2 text-left">Bác sĩ</th>
                <th className="px-4 py-2 text-left">Bắt đầu</th>
                <th className="px-4 py-2 text-left">Kết thúc</th>
                <th className="px-4 py-2 text-left">Mã</th>
                <th className="px-4 py-2 text-left">Tên phác đồ</th>
                <th className="px-4 py-2 text-left">Lịch uống</th>
                <th className="px-4 py-2 text-left">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                paginated.map((regimen, idx) => (
                  <tr key={regimen.arvRegimenId} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2">{regimen.customerName}</td>
                    <td className="px-4 py-2">{regimen.doctorName}</td>
                    <td className="px-4 py-2">{format(new Date(regimen.createDate), "dd/MM/yyyy")}</td>
                    <td className="px-4 py-2">{format(new Date(regimen.endDate), "dd/MM/yyyy")}</td>
                    <td className="px-4 py-2">{regimen.regimenCode}</td>
                    <td className="px-4 py-2">{regimen.regimenName}</td>
                    <td className="px-4 py-2">{regimen.medicationSchedule || "-"}</td>
                    <td className="px-4 py-2">{regimen.description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>
            Trang {currentPage} / {totalPages} ({filtered.length} kết quả)
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "hover:bg-gray-100"}`}
            >
              ← Trước
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1 rounded border ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "hover:bg-gray-100"}`}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
