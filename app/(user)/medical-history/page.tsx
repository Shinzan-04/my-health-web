"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

type MedicalHistory = {
  medicalHistoryId: number;
  customerID: number | null;
  customerName?: string;
  doctorId: number;
  doctorName: string;
  diseaseName: string;
  visitDate: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
};

export default function MedicalHistoryTable() {
  const [data, setData] = useState<MedicalHistory[]>([]);
  const [filteredData, setFilteredData] = useState<MedicalHistory[]>([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const histories = await ApiService.getMyMedicalHistories();
        setData(histories);
        setFilteredData(histories);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu hồ sơ bệnh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lowerSearch = searchName.toLowerCase();
    const filtered = data.filter((item) =>
      item.customerName?.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchName, data]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header + Tìm kiếm */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-blue-800">Hồ sơ bệnh án của bạn</h2>
        <input
          type="text"
          placeholder="🔍 Tìm theo tên bệnh nhân..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-96 text-gray-700"
        />
      </div>

      {/* Nội dung bảng */}
      {loading ? (
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded border border-gray-300 shadow bg-white">
            <table className="min-w-[1200px] w-full text-sm text-gray-900">
              <thead className="bg-white border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Bệnh nhân</th>
                  <th className="px-4 py-2 text-left">Bác sĩ</th>
                  <th className="px-4 py-2 text-left">Tên bệnh</th>
                  <th className="px-4 py-2 text-center">Ngày khám</th>
                  <th className="px-4 py-2 text-left">Lý do</th>
                  <th className="px-4 py-2 text-left">Chẩn đoán</th>
                  <th className="px-4 py-2 text-left">Điều trị</th>
                  <th className="px-4 py-2 text-left">Đơn thuốc</th>
                  <th className="px-4 py-2 text-left">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-4 text-gray-500">
                      Không có dữ liệu.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.medicalHistoryId}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2">{item.medicalHistoryId}</td>
                      <td className="px-4 py-2">{item.customerName ?? "N/A"}</td>
                      <td className="px-4 py-2">{item.doctorName}</td>
                      <td className="px-4 py-2">{item.diseaseName}</td>
                      <td className="px-4 py-2 text-center">{formatDate(item.visitDate)}</td>
                      <td className="px-4 py-2">{item.reason}</td>
                      <td className="px-4 py-2">{item.diagnosis}</td>
                      <td className="px-4 py-2">{item.treatment}</td>
                      <td className="px-4 py-2">{item.prescription}</td>
                      <td className="px-4 py-2">{item.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
            <span>
              Trang {currentPage} / {totalPages} ({filteredData.length} kết quả)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "hover:bg-gray-100"}`}
              >
                ← Trước
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={`px-3 py-1 rounded border ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "hover:bg-gray-100"}`}
              >
                Sau →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
