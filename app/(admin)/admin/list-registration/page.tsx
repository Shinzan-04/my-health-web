// components/RegistrationManager.tsx
"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

export default function RegistrationManager() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    ApiService.getAllRegistrations().then(setRegistrations);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Quản lý phiếu đăng ký</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Ngày khám</th>
            <th>Buổi</th>
            <th>Bác sĩ</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r) => (
            <tr key={r.id}>
              <td>{r.fullName}</td>
              <td>{r.appointmentDate}</td>
              <td>{r.session}</td>
              <td>{r.doctorName}</td>
              <td>{r.status || "Chưa xác nhận"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
