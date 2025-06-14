"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MedicalHistoryDetail() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("authData");
    if (!raw) {
      setError("Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    try {
      const authData = JSON.parse(raw);
      const token = authData.token || authData.accessToken;
      if (!token) throw new Error("Token không hợp lệ.");
      // Lấy customerId bằng cách fetch /api/customers/me giống trang edit
      fetch("http://localhost:8080/api/customers/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể tải hồ sơ người dùng.");
          return res.json();
        })
        .then((data) => {
          const customerId = data.customerID;
          // Lấy medical history theo customerId
          return fetch(
            `http://localhost:8080/api/medical-histories/customer/${customerId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        })
        .then((res) => {
          if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu lịch sử khám bệnh");
          return res.json();
        })
        .then((data) => {
          console.log("API response:", data);
          if (Array.isArray(data)) setHistory(data);
          else if (data && Array.isArray(data.content)) setHistory(data.content);
          else setHistory([]);
        })
        .catch((err) => {
          console.error("Error fetching medical history:", err);
          setError(err.message || "Lỗi không xác định");
        })
        .finally(() => setLoading(false));
    } catch (err) {
      setError("Lỗi khi đọc token từ localStorage");
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-0 bg-gray-100 flex items-start justify-center pt-10 px-2">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Lịch sử khám bệnh
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 border text-lg">Ngày khám</th>
                <th className="py-3 px-6 border text-lg">Lý do khám</th>
                <th className="py-3 px-6 border text-lg">Chẩn đoán</th>
                <th className="py-3 px-6 border text-lg">Điều trị</th>
                <th className="py-3 px-6 border text-lg">Đơn thuốc</th>
                <th className="py-3 px-6 border text-lg">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td className="py-3 px-6 border text-center" colSpan={6}>
                    Không có dữ liệu lịch sử khám bệnh.
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={item.medicalHistoryId || idx} className="bg-white">
                    <td className="py-3 px-6 border text-base whitespace-nowrap">
                      {item.visitDate}
                    </td>
                    <td className="py-3 px-6 border text-base">{item.reason}</td>
                    <td className="py-3 px-6 border text-base">
                      {item.diagnosis}
                    </td>
                    <td className="py-3 px-6 border text-base">
                      {item.treatment}
                    </td>
                    <td className="py-3 px-6 border text-base">
                      {item.prescription}
                    </td>
                    <td className="py-3 px-6 border text-base">{item.notes}</td>
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
