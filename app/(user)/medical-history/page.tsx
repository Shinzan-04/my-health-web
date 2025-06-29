
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    // Retrieve and validate authData from localStorage
    const stored = localStorage.getItem("authData");
    if (stored && stored.trim() !== "") {
      try {
        const authData = JSON.parse(stored);
        console.log("AuthData from localStorage:", authData); // Debug log

        // Try multiple paths for customerID
        const userCustomerId =
          authData?.customer?.customerID ||
          authData?.account?.customerID ||
          authData?.customerID ||
          null;

        if (!userCustomerId) {
          // Fallback to API call if customerID not found in authData
          ApiService.getCurrentCustomer()
            .then((customer) => {
              const id = customer?.customerID || null;
              if (!id) {
                throw new Error("Không tìm thấy customerID từ API.");
              }
              setCustomerId(id);
              console.log("CustomerID from API:", id);
            })
            .catch((err) => {
              console.error("Lỗi khi lấy thông tin khách hàng:", err);
              setError("Không thể xác định khách hàng. Vui lòng đăng nhập lại.");
            });
        } else {
          setCustomerId(userCustomerId);
          console.log("CustomerID from authData:", userCustomerId);
        }
      } catch (err) {
        console.warn("Lỗi phân tích authData:", err);
        setError("Lỗi khi đọc dữ liệu đăng nhập. Vui lòng đăng nhập lại.");
      }
    } else {
      console.warn("authData không tồn tại hoặc rỗng trong localStorage");
      setError("Vui lòng đăng nhập để xem hồ sơ bệnh án.");
    }
  }, []);

  useEffect(() => {
    if (customerId !== null) {
      ApiService.getMedicalHistoriesByCustomerId(customerId)
        .then((res) => {
          setData(res);
          console.log("Fetched medical histories:", res);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy dữ liệu lịch sử khám:", err);
          setError("Không thể tải dữ liệu hồ sơ bệnh. Vui lòng thử lại.");
        })
        .finally(() => setLoading(false));
    } else if (!error) {
      setLoading(false); // Ensure loading stops if no customerId and no error set yet
    }
  }, [customerId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Hồ sơ bệnh án</h1>

      {loading ? (
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-400 shadow-sm bg-white">
    <table className="min-w-full text-sm text-gray-900">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="border border-gray-400 px-4 py-2 text-left">ID</th>
          <th className="border border-gray-400 px-4 py-2 text-left">Bệnh nhân</th>
          <th className="border border-gray-400 px-4 py-2 text-left">Bác sĩ</th>
          <th className="border border-gray-400 px-4 py-2 text-left">Tên bệnh</th>
          <th className="border border-gray-400 px-4 py-2 text-left">Ngày khám</th>
          <th className="border border-gray-400 px-4 py-2 text-left">Chẩn đoán</th>
          <th className="border border-gray-400 px-4 py-2 text-left">Đơn thuốc</th>
          <th className="border border-gray-400 px-4 py-2 text-left">Ghi chú</th>
        </tr>
      </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500 border">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
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
                    <td className="border border-gray-300 px-4 py-2">{item.diagnosis}</td>
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
