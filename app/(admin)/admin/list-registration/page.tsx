"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Registration = {
  registrationId: number;
  doctorId: number;
  doctorName: string;
  slotId: number;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  fullName: string | null;
  email: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  specialization: string | null;
  mode: string;
  symptom: string | null;
  notes: string | null;
  visitType: string;
  status: boolean;
};


export default function RegistrationManager() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filtered, setFiltered] = useState<Registration[]>([]);
  const [doctorIdFilter, setDoctorIdFilter] = useState<string>("");
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>("");
  const [modeFilter, setModeFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  const exportToExcel = () => {
    const exportData = filtered.map((r) => ({
      "Mã đăng ký": r.registrationId,
      "Tên bác sĩ": r.doctorName  || "Không rõ",
      "Họ tên": r.fullName,
      "Email": r.email,
      "Giới tính": r.gender,
      "Ngày sinh": r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString("vi-VN") : "-",
      "Số điện thoại": r.phone,
      "Địa chỉ": r.address,
      "Chuyên khoa": r.specialization,
      "Hình thức": r.mode,
      "Ngày khám": r.appointmentDate
        ? new Date(r.appointmentDate).toLocaleDateString("vi-VN")
        : "-",
      "Giờ khám": `${r.startTime || "-"} - ${r.endTime || "-"}`,
      "Triệu chứng": r.symptom,
      "Ghi chú": r.notes,
      "Loại khám": r.visitType,
      "Trạng thái": r.status ? "ĐÃ KHÁM" : "CHƯA KHÁM",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách đăng ký");
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "danh_sach_dang_ky.xlsx");
  };

  useEffect(() => {
    ApiService.getAllRegistrations().then((data) => {
      setRegistrations(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    let temp = registrations;

    if (doctorIdFilter) {
      temp = temp.filter((r) => r.doctorId.toString() === doctorIdFilter);
    }
    if (visitTypeFilter) {
      temp = temp.filter((r) => r.visitType === visitTypeFilter);
    }
    if (modeFilter) {
      temp = temp.filter((r) => r.mode === modeFilter);
    }
    if (dateFilter) {
      temp = temp.filter((r) => r.appointmentDate?.startsWith(dateFilter));
    }


    setFiltered(temp);
  }, [doctorIdFilter, visitTypeFilter, modeFilter, dateFilter, registrations]);

  return (
<div className="p-6 text-gray-900">
  <h1 className="text-xl font-bold mb-4">Quản lý phiếu đăng ký</h1>

  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
    <input
      type="text"
      placeholder="Lọc theo Doctor ID"
      value={doctorIdFilter}
      onChange={(e) => setDoctorIdFilter(e.target.value)}
      className="border p-2 rounded"
    />

    <select
      value={visitTypeFilter}
      onChange={(e) => setVisitTypeFilter(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Tất cả loại khám</option>
      <option value="REGISTRATION">Khám</option>
      <option value="APPOINTMENT">Tư vấn</option>
    </select>

    <select
      value={modeFilter}
      onChange={(e) => setModeFilter(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Tất cả hình thức</option>
      <option value="Online">Online</option>
      <option value="Offline">Offline</option>
    </select>

    <input
      type="date"
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
      className="border p-2 rounded"
    />

    <button
      onClick={exportToExcel}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Xuất Excel
    </button>
  </div>


      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Doctor ID</th>
            <th className="border px-2 py-1">Tên bác sĩ</th>
            <th className="border px-2 py-1">Họ tên</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Giới tính</th>
            <th className="border px-2 py-1">Ngày sinh</th>
            <th className="border px-2 py-1">SĐT</th>
            <th className="border px-2 py-1">Địa chỉ</th>
            <th className="border px-2 py-1">Chuyên khoa</th>
            <th className="border px-2 py-1">Hình thức</th>
            <th className="border px-2 py-1">Ngày khám</th>
            <th className="border px-2 py-1">Giờ khám</th>
            <th className="border px-2 py-1">Triệu chứng</th>
            <th className="border px-2 py-1">Ghi chú</th>
            <th className="border px-2 py-1">Loại khám</th>
            <th className="border px-2 py-1">Trạng thái</th>
            <th className="border px-2 py-1">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.registrationId}>


              <td className="border px-2 py-1">{r.registrationId}</td>
              <td className="border px-2 py-1">{r.doctorId}</td>
              <td className="border px-2 py-1">{r.doctorName  || "Không rõ"}</td>
              <td className="border px-2 py-1">{r.fullName || "-"}</td>
              <td className="border px-2 py-1">{r.email || "-"}</td>
              <td className="border px-2 py-1">{r.gender || "-"}</td>
              <td className="border px-2 py-1">{r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString("vi-VN") : "-"}</td>
              <td className="border px-2 py-1">{r.phone || "-"}</td>
              <td className="border px-2 py-1">{r.address || "-"}</td>
              <td className="border px-2 py-1">{r.specialization || "-"}</td>
              <td className="border px-2 py-1">{r.mode}</td>
              <td className="border px-2 py-1">
                {r.appointmentDate
                  ? new Date(r.appointmentDate).toLocaleDateString("vi-VN")
                  : "-"}
              </td>
              <td className="border px-2 py-1">{r.startTime} - {r.endTime}</td>
              <td className="border px-2 py-1">{r.symptom || "-"}</td>
              <td className="border px-2 py-1">{r.notes || "-"}</td>
              <td className="border px-2 py-1">
                {r.visitType === "REGISTRATION" ? "Khám" : r.visitType === "APPOINTMENT" ? "Tư vấn" : "-"}
              </td>
              <td className="border px-2 py-1">{r.status ? "ĐÃ KHÁM" : "CHƯA KHÁM"}</td>
              <td className="border px-2 py-1">
                <button
                  className={`px-2 py-1 rounded text-white ${r.status ? "bg-red-500" : "bg-green-500"}`}
                  onClick={async () => {
                    try {
                      const updated = await ApiService.updateRegistrationStatus(r.registrationId, !r.status);
                      const newList = registrations.map((reg) =>
                        reg.registrationId === r.registrationId ? { ...reg, status: updated.status } : reg
                      );
                      setRegistrations(newList);
                      setFiltered(newList);
                    } catch (err) {
                      console.error("Lỗi khi cập nhật trạng thái:", err);
                    }
                  }}
                >
                  {r.status ? "Đặt lại CHƯA KHÁM" : "Đánh dấu ĐÃ KHÁM"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}