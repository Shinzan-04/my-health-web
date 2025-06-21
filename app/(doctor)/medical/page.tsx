"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

type Registration = {
  registrationID: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  customerId: number | null;
  session: string;
  doctorId: number;
};

export default function RegistrationBasicList() {
  const [data, setData] = useState<Registration[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ApiService.getAllRegistrations();

        const authData = JSON.parse(localStorage.getItem("authData") || "{}");
        const doctorId = authData?.doctor?.doctorId;

        if (!doctorId) {
          console.warn("Không tìm thấy doctorId trong authData");
          return;
        }

        // ✅ Lọc theo doctor đang đăng nhập
        const filtered = res.filter((reg: Registration) => reg.doctorId === doctorId);
        setData(filtered);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách bệnh nhân:", err);
      }
    };

    fetchData();
  }, []);

  const handleComplete = async (id: number) => {
    try {
      await ApiService.markRegistrationCompleted(id);
      setData((prevData) => prevData.filter((item) => item.registrationID !== id));
    } catch (err) {
      console.error("Lỗi khi hoàn thành đăng ký:", err);
    }
  };

  const getCurrentSession = (): string => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 12) return "Sáng";
    if (hour >= 13 && hour <= 17) return "Chiều";
    return "";
  };

  const currentSession = getCurrentSession();
  const currentData = data.filter((p) => p.session === currentSession);

  const renderTable = (list: Registration[], title: string) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">🕒 {title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3">Họ tên</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">SĐT</th>
              <th className="px-6 py-3">Giới tính</th>
              <th className="px-6 py-3">Ngày sinh</th>
              <th className="px-6 py-3">Địa chỉ</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.registrationID} className="hover:bg-gray-50">
                <td className="px-6 py-3">{p.fullName}</td>
                <td className="px-6 py-3">{p.email}</td>
                <td className="px-6 py-3">{p.phone}</td>
                <td className="px-6 py-3">{p.gender}</td>
                <td className="px-6 py-3">{p.dateOfBirth}</td>
                <td className="px-6 py-3">{p.address}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleComplete(p.registrationID)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Hoàn thành
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        🧾 Lịch Khám – Buổi {currentSession || "Không xác định"}
      </h2>
      {currentData.length > 0 ? (
        renderTable(currentData, `Buổi ${currentSession}`)
      ) : (
        <p className="text-gray-500">
          Không có đăng ký nào cho buổi {currentSession || "này"}.
        </p>
      )}
    </div>
  );
}
