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

  useEffect(() => {
    ApiService.getMedicalHistories()
      .then((res) => {
        setData(res);
        setFilteredData(res);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải dữ liệu hồ sơ bệnh.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Lọc khi nhập tên
  useEffect(() => {
    const lowerSearch = searchName.toLowerCase();
    const filtered = data.filter((item) =>
      item.customerName?.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
  }, [searchName, data]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Hồ sơ bệnh án</h1>

      <input
        type="text"
        placeholder="Tìm theo tên bệnh nhân..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
          <table className="min-w-[1200px] w-full text-sm text-gray-700 border border-gray-300">
            <thead className="bg-blue-100 text-blue-800 text-sm font-semibold uppercase tracking-wide border-b border-gray-300">
              <tr>
                <th className="border border-gray-300 px-4 py-3">ID</th>
                <th className="border border-gray-300 px-4 py-3">Bệnh nhân</th>
                <th className="border border-gray-300 px-4 py-3">Bác sĩ</th>
                <th className="border border-gray-300 px-4 py-3">Tên bệnh</th>
                <th className="border border-gray-300 px-4 py-3">Ngày khám</th>
                <th className="border border-gray-300 px-4 py-3">Lý do</th>
                <th className="border border-gray-300 px-4 py-3">Chẩn đoán</th>
                <th className="border border-gray-300 px-4 py-3">Điều trị</th>
                <th className="border border-gray-300 px-4 py-3">Đơn thuốc</th>
                <th className="border border-gray-300 px-4 py-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500 border">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.medicalHistoryId}
                    className={
                      index % 2 === 0
                        ? "bg-white hover:bg-blue-50"
                        : "bg-gray-50 hover:bg-blue-50"
                    }
                  >
                    <td className="border border-gray-300 px-4 py-2">{item.medicalHistoryId}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.customerName ?? "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2 text-blue-700 font-medium">
                      {item.doctorName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{item.diseaseName}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(item.visitDate)}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.reason}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.diagnosis}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.treatment}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.prescription}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
