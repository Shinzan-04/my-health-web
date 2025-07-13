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
    ApiService.getAllRegistrations().then((data) => {
      setRegistrations(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    let temp = registrations;
    if (doctorIdFilter) temp = temp.filter((r) => r.doctorId.toString() === doctorIdFilter);
    if (visitTypeFilter) temp = temp.filter((r) => r.visitType === visitTypeFilter);
    if (modeFilter) temp = temp.filter((r) => r.mode === modeFilter);
    if (dateFilter) temp = temp.filter((r) => r.appointmentDate?.startsWith(dateFilter));
    setFiltered(temp);
  }, [doctorIdFilter, visitTypeFilter, modeFilter, dateFilter, registrations]);

  return (
    <div className="p-6 text-gray-900 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold whitespace-nowrap">📋 Quản lý phiếu đăng ký</h1>
        <button
          onClick={exportToExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
        >
          📥 Xuất Excel
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Lọc theo Doctor ID"
          value={doctorIdFilter}
          onChange={(e) => setDoctorIdFilter(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <select
          value={visitTypeFilter}
          onChange={(e) => setVisitTypeFilter(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Tất cả loại khám</option>
          <option value="REGISTRATION">Khám</option>
          <option value="APPOINTMENT">Tư vấn</option>
        </select>
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Tất cả hình thức</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-[1300px] text-sm text-left border-collapse">
          <thead className=" text-gray-900 text-[13px] uppercase tracking-wide font-semibold">
            <tr>
              {[
                "STT", "Tên bác sĩ", "Họ tên", "Email", "Giới tính", "Ngày sinh", "SĐT",
                "Địa chỉ", "Chuyên khoa", "Hình thức", "Ngày khám", "Giờ khám", "Triệu chứng",
                "Ghi chú", "Loại khám", "Trạng thái", "Thao tác"
              ].map((header) => (
                <th key={header} className="px-4 py-3 whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, index) => (
              <tr
                key={r.registrationId}
                className="even:bg-blue-100 hover:bg-gray-200 transition"
              >
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2">{r.doctorName || "Không rõ"}</td>
                <td className="px-4 py-2">{r.fullName || "-"}</td>
                <td className="px-4 py-2">{r.email || "-"}</td>
                <td className="px-4 py-2">{r.gender || "-"}</td>
                <td className="px-4 py-2">
                  {r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString("vi-VN") : "-"}
                </td>
                <td className="px-4 py-2">{r.phone || "-"}</td>
                <td className="px-4 py-2 break-words max-w-[160px]">{r.address || "-"}</td>
                <td className="px-4 py-2">{r.specialization || "-"}</td>
                <td className="px-4 py-2">{r.mode}</td>
                <td className="px-4 py-2">
                  {r.appointmentDate ? new Date(r.appointmentDate).toLocaleDateString("vi-VN") : "-"}
                </td>
                <td className="px-4 py-2">{r.startTime} - {r.endTime}</td>
                <td className="px-4 py-2 break-words max-w-[200px]">{r.symptom || "-"}</td>
                <td className="px-4 py-2 break-words max-w-[200px]">{r.notes || "-"}</td>
                <td className="px-4 py-2">
                  {r.visitType === "REGISTRATION" ? "Khám" : r.visitType === "APPOINTMENT" ? "Tư vấn" : "-"}
                </td>
                <td className={`font-medium ${r.status ? "text-green-600" : "text-yellow-600"}`}>
                  {r.status ? "ĐÃ KHÁM" : "CHƯA KHÁM"}
                </td>
                <td className="px-2 py-2">
                  <button
                    className={`px-2 py-1 rounded-md text-white text-center font-semibold transition ${
                      r.status ? "a hover:scale-200" : " hover:scale-200 "
                    }`}
                    onClick={async () => {
                      try {
                        const updated = await ApiService.updateRegistrationStatus(r.registrationId, !r.status);
                        const newList = registrations.map((reg) =>
                          reg.registrationId === r.registrationId ? { ...reg, status: updated.status } : reg
                        );
                        setRegistrations(newList);
                        setFiltered(newList);
                        toast.success("Cập nhật trạng thái thành công", {
                          style: { background: "#f0fdf4", color: "#166534" },
                        });
                      } catch (err) {
                        toast.error("Cập nhật trạng thái thất bại", {
                          style: { background: "#fef2f2", color: "#b91c1c" },
                        });
                      }
                    }}
                  >
                    {r.status ? "↩️" : "✔️"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
