"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import moment from "moment";

type Registration = {
  id: number;
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  doctorName: string;
  specialization: string;
  mode: string;
  appointmentDate: string;
  session: string;
  symptom?: string;
  notes?: string;
};

export default function RegistrationListPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getAllRegistrations()
      .then((data) => setRegistrations(data))
      .catch((error) => console.error("Lỗi khi lấy danh sách đăng ký:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách đăng ký khám bệnh</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Họ tên</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Giới tính</th>
                <th className="border px-4 py-2">Ngày sinh</th>
                <th className="border px-4 py-2">SĐT</th>
                <th className="border px-4 py-2">Địa chỉ</th>
                <th className="border px-4 py-2">Bác sĩ</th>
                <th className="border px-4 py-2">Chuyên khoa</th>
                <th className="border px-4 py-2">Hình thức</th>
                <th className="border px-4 py-2">Ngày khám</th>
                <th className="border px-4 py-2">Buổi</th>
                <th className="border px-4 py-2">Triệu chứng</th>
                <th className="border px-4 py-2">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, idx) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{idx + 1}</td>
                  <td className="border px-4 py-2">{r.fullName}</td>
                  <td className="border px-4 py-2">{r.email}</td>
                  <td className="border px-4 py-2 text-center">{r.gender}</td>
                  <td className="border px-4 py-2 text-center">
                    {moment(r.dateOfBirth).format("DD/MM/YYYY")}
                  </td>
                  <td className="border px-4 py-2">{r.phone}</td>
                  <td className="border px-4 py-2">{r.address}</td>
                  <td className="border px-4 py-2">{r.doctorName}</td>
                  <td className="border px-4 py-2">{r.specialization}</td>
                  <td className="border px-4 py-2">{r.mode}</td>
                  <td className="border px-4 py-2">
                    {moment(r.appointmentDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="border px-4 py-2">{r.session}</td>
                  <td className="border px-4 py-2">{r.symptom || "-"}</td>
                  <td className="border px-4 py-2">{r.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
