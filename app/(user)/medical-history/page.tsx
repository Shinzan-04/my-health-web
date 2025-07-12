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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 flex justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-6xl border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-800 tracking-wide">
          Lịch sử khám bệnh
        </h2>

        <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 mt-6">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-blue-100 text-gray-900 text-md uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 border">Ngày khám</th>
                <th className="px-4 py-3 border">Lý do khám</th>
                <th className="px-4 py-3 border">Chẩn đoán</th>
                <th className="px-4 py-3 border">Điều trị</th>
                <th className="px-4 py-3 border">Đơn thuốc</th>
                <th className="px-4 py-3 border">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <svg
                        className="w-10 h-10 text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        />
                      </svg>
                      <span>Không có dữ liệu lịch sử khám bệnh.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((history, index) => (
                  <tr
                    key={history.medicalHistoryId || index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 border">
                      {formatDate(history.visitDate)}
                    </td>
                    <td className="px-4 py-3 border">{history.reason}</td>
                    <td className="px-4 py-3 border">{history.diagnosis}</td>
                    <td className="px-4 py-3 border">{history.treatment}</td>
                    <td className="px-4 py-3 border">{history.prescription}</td>
                    <td className="px-4 py-3 border">{history.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
