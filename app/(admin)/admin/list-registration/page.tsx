"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

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
  const [userRole, setUserRole] = useState<string>("");
  const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);

  const exportToExcel = () => {
    const exportData = filtered.map((r) => ({
      "Mã đăng ký": r.registrationId,
      "Tên bác sĩ": r.doctorName || "Không rõ",
      "Họ tên": r.fullName,
      "Email": r.email,
      "Giới tính": r.gender,
      "Ngày sinh": r.dateOfBirth
        ? new Date(r.dateOfBirth).toLocaleDateString("vi-VN")
        : "-",
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
  const authData = localStorage.getItem("authData");
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      const role = parsed?.account?.role || parsed?.role || "";
      const doctorId = parsed?.doctor?.doctorId || parsed?.account?.doctor?.doctorId;

      setUserRole(role);
      setCurrentDoctorId(doctorId || null);
    } catch (err) {
      console.error("Lỗi phân tích authData:", err);
    }
  }
}, []);

  useEffect(() => {
  const fetchRegistrations = async () => {
    try {
      const data = await ApiService.getAllRegistrations();

      let visibleData = data;

      if (userRole === "DOCTOR" && currentDoctorId !== null) {
        visibleData = data.filter((r: Registration) => r.doctorId === currentDoctorId);
      }

      setRegistrations(visibleData);
      setFiltered(visibleData);
    } catch (error) {
      console.error("Lỗi khi load registrations:", error);
    }
  };

  if (userRole) fetchRegistrations();
}, [userRole, currentDoctorId]);


  useEffect(() => {
  let temp = registrations;

  if (userRole === "ADMIN" && doctorIdFilter) {
    temp = temp.filter((r) => r.doctorId.toString() === doctorIdFilter);
  }

  if (visitTypeFilter) temp = temp.filter((r) => r.visitType === visitTypeFilter);
  if (modeFilter) temp = temp.filter((r) => r.mode === modeFilter);
  if (dateFilter) temp = temp.filter((r) => r.appointmentDate?.startsWith(dateFilter));

  setFiltered(temp);
}, [doctorIdFilter, visitTypeFilter, modeFilter, dateFilter, registrations, userRole]);


  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-xl font-bold mb-4">Quản lý phiếu đăng ký</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {userRole === "ADMIN" && (
  <input
    type="text"
    placeholder="Lọc theo Doctor ID"
    value={doctorIdFilter}
    onChange={(e) => setDoctorIdFilter(e.target.value)}
    className="border p-2 rounded"
  />
)}

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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          📥 Xuất Excel
        </button>
      </div>

      <table className="w-full text-sm border-collapse rounded-lg overflow-hidden shadow-sm ">
        <thead className="bg-gray-100 sticky top-0 z-10 bg-gray-300 text-gray-900">
          <tr>
            {[
              "ID", "Doctor ID", "Tên bác sĩ", "Họ tên", "Email", "Giới tính", "Ngày sinh", "SĐT",
              "Địa chỉ", "Chuyên khoa", "Hình thức", "Ngày khám", "Giờ khám", "Triệu chứng", "Ghi chú",
              "Loại khám", "Trạng thái", "Thao tác"
            ].map((header) => (
              <th key={header} className="border px-2 py-1">{header}</th>
            ))}
          </tr>
        </thead>
<tbody>
  {filtered.map((r) => (
    <tr key={r.registrationId} className="hover:bg-gray-100 transition">
      <td className="border px-2 py-1">{r.registrationId}</td>
      <td className="border px-2 py-1">{r.doctorId}</td>
      <td className="border px-2 py-1">{r.doctorName || "Không rõ"}</td>
      <td className="border px-2 py-1">{r.fullName || "-"}</td>
      <td className="border px-2 py-1">{r.email || "-"}</td>
      <td className="border px-2 py-1">{r.gender || "-"}</td>
      <td className="border px-2 py-1">
        {r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString("vi-VN") : "-"}
      </td>
      <td className="border px-2 py-1">{r.phone || "-"}</td>
      <td className="border px-2 py-1 break-words whitespace-pre-line max-w-[180px]">
        {r.address || "-"}
      </td>
      <td className="border px-2 py-1">{r.specialization || "-"}</td>
      <td className="border px-2 py-1">{r.mode}</td>
      <td className="border px-2 py-1">
        {r.appointmentDate ? new Date(r.appointmentDate).toLocaleDateString("vi-VN") : "-"}
      </td>
      <td className="border px-2 py-1">{r.startTime} - {r.endTime}</td>
      <td className="border px-2 py-1 break-words whitespace-pre-line max-w-[200px]">
        {r.symptom || "-"}
      </td>
      <td className="border px-2 py-1 break-words whitespace-pre-line max-w-[200px]">
        {r.notes || "-"}
      </td>
      <td className="border px-2 py-1">
        {r.visitType === "REGISTRATION" ? "Khám" : r.visitType === "APPOINTMENT" ? "Tư vấn" : "-"}
      </td>
      <td className={`border px-2 py-1 font-medium ${r.status ? "text-green-600" : "text-yellow-600"}`}>
        {r.status ? "ĐÃ KHÁM" : "CHƯA KHÁM"}
      </td>
      <td className="border px-2 py-1">
        <button
          className={`px-3 py-1 rounded font-semibold text-white transition ${
            r.status ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={async () => {
            try {
              const updated = await ApiService.updateRegistrationStatus(r.registrationId, !r.status);
              const newList = registrations.map((reg) =>
                reg.registrationId === r.registrationId ? { ...reg, status: updated.status } : reg
              );
              setRegistrations(newList);
              setFiltered(newList);
              toast.success(`✅ Cập nhật trạng thái thành công`, {
                style: { background: "#f0fdf4", color: "#166534" },
              });
            } catch (err) {
              toast.error("❌ Cập nhật trạng thái thất bại", {
                style: { background: "#fef2f2", color: "#b91c1c" },
              });
            }
          }}
        >
          {r.status ? "↩️ Đặt lại" : "✔️ Đánh dấu"}
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
