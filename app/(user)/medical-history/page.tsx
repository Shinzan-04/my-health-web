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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 py-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 sm:p-10 space-y-8 border border-blue-100">
        {/* Header + Tìm kiếm */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold italic text-blue-900 font-sans mb-2 tracking-tight drop-shadow-md">
            Hồ sơ bệnh án của bạn
          </h1>
          <p className="text-gray-500 text-sm">
            Xem lại lịch sử khám và điều trị của bạn
          </p>
        </div>
        {/* Nội dung bảng */}
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-black bg-white">
          <table className="min-w-full text-base text-gray-700">
            <thead className="bg-blue-100 text-blue-900 uppercase tracking-wider text-sm">
              <tr>
                <th className="border border-black px-4 py-3 text-left">ID</th>
                <th className="border border-black px-4 py-3 text-left">
                  Bệnh nhân
                </th>
                <th className="border border-black px-4 py-3 text-left">
                  Bác sĩ
                </th>
                <th className="border border-black px-4 py-3 text-left">
                  Tên bệnh
                </th>
                <th className="border border-black px-4 py-3 text-center">
                  Ngày khám
                </th>
                <th className="border border-black px-4 py-3 text-left">
                  Lý do
                </th>
                <th className="border border-black px-4 py-3 text-left">
                  Chẩn đoán
                </th>
                <th className="border border-black px-4 py-3 text-left">
                  Điều trị
                </th>
                <th className="border border-black px-4 py-3 text-left">
                  Đơn thuốc
                </th>
                <th className="border border-black px-4 py-3 text-left">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500 border border-black">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-red-600 border border-black">
                    {error}
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500 border border-black">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.medicalHistoryId}
                    className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
                  >
                    <td className="border border-black px-4 py-2">
                      {item.medicalHistoryId}
                    </td>
                    <td className="border border-black px-4 py-2 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">
                      {item.customerName ?? "N/A"}
                    </td>
                    <td className="border border-black px-4 py-2 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">
                      {item.doctorName}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.diseaseName}
                    </td>
                    <td className="border border-black px-4 py-2 text-center">
                      {formatDate(item.visitDate)}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.reason}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.diagnosis}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.treatment}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.prescription}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.notes}
                    </td>
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
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              ← Trước
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
