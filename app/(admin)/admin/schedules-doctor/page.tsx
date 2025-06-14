// components/DoctorScheduleManager.tsx
"use client";
import { useState, useEffect } from "react";
import ApiService from "@/app/service/ApiService";
type Doctor = {
  doctorId: number;
  fullName: string;
};

type Schedule = {
  scheduleId: number;
  date: string;
  session: string;
};


export default function DoctorScheduleManager() {
const [doctors, setDoctors] = useState<Doctor[]>([]);
const [schedules, setSchedules] = useState<Schedule[]>([]);
const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");


  useEffect(() => {
    ApiService.getAllDoctors().then(setDoctors);
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      ApiService.getSchedulesByDoctor(selectedDoctorId).then(setSchedules);
    }
  }, [selectedDoctorId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Lịch làm việc bác sĩ</h1>
      <select
        value={selectedDoctorId}
        onChange={(e) => setSelectedDoctorId(e.target.value)}
        className="mb-4 p-2 border text-gray-900 rounded"
      >
        <option value="">-- Chọn bác sĩ --</option>
        {doctors.map((d) => (
          <option key={d.doctorId} value={d.doctorId}>
            {d.fullName}
          </option>
        ))}
      </select>

      <table className="w-full border text-gray-900">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Buổi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.scheduleId}>
              <td>{s.date}</td>
              <td>{s.session}</td>
              <td>
                <button className="text-blue-600">Sửa</button>
                <button className="text-red-600 ml-2">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
