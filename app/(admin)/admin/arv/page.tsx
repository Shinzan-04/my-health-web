"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApiService from "@/app/service/ApiService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MoreVertical } from "lucide-react";

/* ---------- Types ---------- */

type ARVRegimen = {
  arvRegimenId?: number;
  doctorId?: number;
  doctorName?: string;
  customerId?: number | null;
  customerName: string;
  createDate: string;
  endDate: string;
  regimenName: string;
  regimenCode: string;
  description: string;
  medicationSchedule: string;
  duration: number;
  email?: string;
  diseaseName?: string;
  diagnosis?: string;
  prescription?: string;
  reason?: string;
  treatment?: string;
  notes?: string;
};

/* ---------- Constants ---------- */

const DEFAULT_FORM: ARVRegimen = {
  email: "",
  customerName: "",
  customerId: undefined,
  createDate: "",
  endDate: "",
  regimenName: "",
  regimenCode: "",
  description: "",
  medicationSchedule: "",
  duration: 1,
  diseaseName: "",
  diagnosis: "",
  prescription: "",
  reason: "",
  treatment: "",
  notes: "",
};

const ARV_REGIMEN_OPTIONS = [
  { name: "TDF + 3TC + EFV", code: "TLE" },
  { name: "TDF + 3TC + DTG", code: "TLD" },
  { name: "AZT + 3TC + EFV", code: "ZLE" },
  { name: "AZT + 3TC + NVP", code: "ZLN" },
  { name: "ABC + 3TC + EFV", code: "ALE" },
  { name: "TDF + FTC + DTG", code: "TFD" },
  { name: "ABC + 3TC + DTG", code: "ALD" },
];

const DOSAGE_OPTIONS = ["Sáng", "Trưa", "Chiều", "Tối"];

/* ---------- Component ---------- */

export default function ARVRegimenPage() {
  /* ----- State ----- */
  const [arvs, setArvs] = useState<ARVRegimen[]>([]);
  const [form, setForm] = useState<ARVRegimen>({ ...DEFAULT_FORM });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [role, setRole] = useState<string>("");
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredArvs = arvs.filter((arv) => {
    return (
      arv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (arv.doctorName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (arv.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
    );
  });
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredArvs.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredArvs.length / rowsPerPage);

  /* ----- Close action menu on outside click ----- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(".action-menu") ||
        target.closest(".action-toggle-button")
      )
        return;
      setOpenMenuId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ----- Auth data ----- */
  useEffect(() => {
    const stored = localStorage.getItem("authData");
    if (!stored) return;
    try {
      const authData = JSON.parse(stored);
      const userRole = authData?.account?.role || authData?.role || "";
      setRole(userRole);
      if (userRole === "DOCTOR") setDoctorId(authData?.doctor?.doctorId || null);
    } catch (err) {
      console.warn("authData parse error", err);
    }
  }, []);

  /* ----- Load ARV list whenever role / doctorId changes ----- */
  useEffect(() => {
    fetchARVs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, doctorId]);

  /* ----- Fetch ARVs ----- */
  const fetchARVs = async () => {
    try {
      const data = await ApiService.getARVRegimens();
      if (!Array.isArray(data)) throw new Error("Data is not array");
      if (role === "DOCTOR" && doctorId != null) {
        setArvs(data.filter((arv) => arv.doctorId === doctorId));
      } else {
        setArvs(data);
      }
    } catch (err) {
      console.error("Error fetching ARVs", err);
      setArvs([]);
    }
  };

  /* ----- Helpers ----- */
  const fetchCustomerByEmail = async (email: string) => {
    try {
      const customer = await ApiService.getCustomerByEmail(email);
      setForm((prev) => ({
        ...prev,
        customerName: customer?.fullName || "",
        customerId: customer?.customerID,
      }));
    } catch (err) {
      console.warn("Customer not found", err);
      setForm((prev) => ({ ...prev, customerName: "", customerId: null }));
    }
  };

  /* ----- Form handlers ----- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) : value,
      ...(name === "regimenCode" && {
        regimenName:
          ARV_REGIMEN_OPTIONS.find((o) => o.code === value)?.name || "",
      }),
    }));
  };

  const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const list = form.medicationSchedule
      ? form.medicationSchedule.split(",")
      : [];
    const updated = checked
      ? [...list, value]
      : list.filter((item) => item !== value);
    setForm((prev) => ({ ...prev, medicationSchedule: updated.join(",") }));
  };

  const resetForm = () => {
    setForm({ ...DEFAULT_FORM });
    setEditingId(null);
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const stored = localStorage.getItem("authData");
      if (!stored) throw new Error("authData missing");
      const authData = JSON.parse(stored);
      const payload = {
        ...form,
        doctorId: authData?.doctor?.doctorId,
        ...(editingId && { arvRegimenId: editingId }),
      };
      if (editingId) {
        await ApiService.updateARVWithHistory(payload);
        toast.success("Cập nhật phác đồ thành công!", {
          style: { borderRadius: "8px", background: "#f0fdf4", color: "#065f46" },
        });
      } else {
        await ApiService.createARVWithHistory(payload);
        toast.success("Tạo mới phác đồ thành công!", {
          style: { borderRadius: "8px", background: "#e0f2fe", color: "#1e3a8a" },
        });
      }
      fetchARVs();
      resetForm();
    } catch (err) {
      console.error("Save error", err);
      toast.error("Có lỗi xảy ra khi lưu dữ liệu!", {
        style: { borderRadius: "8px", background: "#fee2e2", color: "#991b1b" },
      });
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await ApiService.deleteARVRegimen(id);
      toast.success("Xóa phác đồ thành công!", {
        style: { borderRadius: "8px", background: "#fef9c3", color: "#92400e" },
      });
      fetchARVs();
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Không thể xóa phác đồ!", {
        style: { borderRadius: "8px", background: "#fee2e2", color: "#991b1b" },
      });
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} phác đồ?`)) return;
    try {
      for (const id of selectedIds) {
        await ApiService.deleteARVRegimen(id);
      }
      toast.success(`Đã xóa ${selectedIds.length} phác đồ thành công.`);
      fetchARVs();
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk delete error", err);
      toast.error("Xóa hàng loạt thất bại!");
    }
  };

  const exportSingleToExcel = (arv: ARVRegimen) => {
    const data = [
      {
        "ID Phác đồ": arv.arvRegimenId ?? "",
        "Tên bác sĩ": arv.doctorName ?? "",
        "Tên bệnh nhân": arv.customerName ?? "",
        "Email bệnh nhân": arv.email ?? "",
        "Ngày bắt đầu": arv.createDate,
        "Ngày kết thúc": arv.endDate,
        "Mã phác đồ": arv.regimenCode,
        "Tên phác đồ": arv.regimenName,
        "Lịch uống": arv.medicationSchedule,
        "Thời gian dùng (số ngày)": arv.duration,
        "Ghi chú chung": arv.description ?? "",
        "Tên bệnh": arv.diseaseName ?? "",
        "Chẩn đoán": arv.diagnosis ?? "",
        "Đơn thuốc": arv.prescription ?? "",
        "Ghi chú bổ sung": arv.notes ?? "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PhacDoARV");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `arv_regimen_${arv.arvRegimenId}.xlsx`
    );
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-6 text-gray-700">
      {/* Page title & add button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý phác đồ ARV</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <input
            type="text"
            placeholder="🔍 Tìm theo bệnh nhân, bác sĩ, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-80"
          />

          {(role === "DOCTOR" || role === "ADMIN") && (
            <>
              <button
                onClick={() => {
                  setForm({ ...DEFAULT_FORM });
                  setShowModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm"
              >
                Thêm
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm"
                >
                  Xóa {selectedIds.length} mục  
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 sm:px-6 lg:px-8"
          onClick={resetForm}
        >
          <div
            className="bg-white w-full max-w-6xl p-6 sm:p-8 rounded-lg shadow-2xl border border-gray-300 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={resetForm}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              {editingId ? "Cập nhật Phác đồ ARV" : "Thêm Phác đồ ARV mới"}
            </h2>

            {/* Form grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Email */}
              <input
                name="email"
                type="email"
                placeholder="Email bệnh nhân"
                value={form.email || ""}
                onChange={handleChange}
                onBlur={(e) => fetchCustomerByEmail(e.target.value)}
                className="border p-3 rounded w-full"
              />
              {/* Customer name (readonly?) */}
              <input
                name="customerName"
                placeholder="Tên bệnh nhân"
                value={form.customerName}
                onChange={handleChange}
                className="border p-3 rounded w-full bg-gray-100"
                readOnly
              />
              {/* Dates */}
              <input
                name="createDate"
                type="date"
                value={form.createDate}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
              {/* Regimen code & name */}
              <select
                name="regimenCode"
                value={form.regimenCode}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              >
                <option value="">-- Chọn mã --</option>
                {ARV_REGIMEN_OPTIONS.map((o) => (
                  <option value={o.code} key={o.code}>
                    {o.code}
                  </option>
                ))}
              </select>
              <input
                name="regimenName"
                value={form.regimenName}
                readOnly
                className="border p-3 rounded w-full bg-gray-100 text-gray-400"
              />
              {/* Description full width */}
              <input
                name="description"
                placeholder="Ghi chú"
                value={form.description}
                onChange={handleChange}
                className="border p-3 rounded w-full col-span-2"
              />

              {/* Disease info title */}
              <div className="col-span-2 font-semibold text-gray-900 mt-4">
                Thông tin bệnh lý
              </div>

              <input
                name="diseaseName"
                placeholder="Tên bệnh"
                value={form.diseaseName}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
              <input
                name="diagnosis"
                placeholder="Chẩn đoán"
                value={form.diagnosis}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              />
              <input
                name="prescription"
                placeholder="Đơn thuốc"
                value={form.prescription}
                onChange={handleChange}
                className="border p-3 rounded w-full col-span-2"
              />
              <textarea
                name="notes"
                placeholder="Ghi chú bệnh lý"
                rows={3}
                value={form.notes || ""}
                onChange={handleChange}
                className="border p-3 rounded w-full col-span-2"
              />
            </div>

            {/* Dosage schedule checkboxes */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">
                Lịch uống:
              </label>
              <div className="flex flex-wrap gap-4">
                {DOSAGE_OPTIONS.map((t) => (
                  <label
                    key={t}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      value={t}
                      checked={form.medicationSchedule.includes(t)}
                      onChange={handleDosageChange}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
              >
                {editingId ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="relative bg-white rounded-lg shadow-md border border-gray-200 overflow-visible">
        <table className="w-full min-w-[1200px] text-sm border-collapse bg-white">
          <thead className="sticky top-0 z-10 bg-white shadow-sm text-gray-800 text-sm font-semibold uppercase tracking-wide border-b border-gray-300">
            <tr>
              <th className="px-2 py-2 text-center w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === filteredArvs.length &&
                    filteredArvs.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(
                        filteredArvs
                          .filter((arv) => arv.arvRegimenId !== undefined)
                          .map((arv) => arv.arvRegimenId!)
                      );
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-center">ID</th>
              <th className="px-4 py-2 text-left w-48">Bác sĩ</th>
              <th className="px-4 py-2 text-left w-48">Bệnh nhân</th>
              <th className="px-3 py-2 text-center w-32">Ngày bắt đầu</th>
              <th className="px-3 py-2 text-center w-32">Ngày kết thúc</th>
              <th className="px-3 py-2 text-center w-20">Mã</th>
              <th className="px-4 py-2 text-left w-48">Phác đồ</th>
              <th className="px-4 py-2 text-left w-40">Lịch uống</th>
              <th className="px-4 py-2 text-left w-[400px]">Ghi chú</th>
              {(role === "DOCTOR" || role === "ADMIN") && (
                <th className="px-2 py-2 text-right w-12"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={(role === "DOCTOR" || role === "ADMIN") ? 11 : 10}
                  className="text-center text-gray-500 py-6"
                >
                  Không có dữ liệu phác đồ ARV nào.
                </td>
              </tr>
            ) : (
              currentRows.map((arv, index) => (
                <tr
                  key={arv.arvRegimenId}
                  className={`transition ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  {/* Checkbox chọn dòng */}
                  <td className="px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={
                        arv.arvRegimenId !== undefined &&
                        selectedIds.includes(arv.arvRegimenId)
                      }
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedIds((p) =>
                              arv.arvRegimenId
                                ? [...p, arv.arvRegimenId]
                                : p
                            )
                          : setSelectedIds((p) =>
                              p.filter((id) => id !== arv.arvRegimenId)
                            )
                      }
                    />
                  </td>

                  <td className="px-2 py-2 text-center">
                    {arv.arvRegimenId ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 text-left truncate max-w-[200px]">
                    {arv.doctorName ?? ""}
                  </td>
                  <td className="px-4 py-2 text-left truncate max-w-[200px]">
                    {arv.customerName ?? ""}
                  </td>
                  <td className="px-3 py-2 text-center">{arv.createDate}</td>
                  <td className="px-3 py-2 text-center">{arv.endDate}</td>
                  <td className="px-3 py-2 text-center">{arv.regimenCode}</td>
                  <td className="px-4 py-2 text-left">{arv.regimenName}</td>
                  <td className="px-4 py-2 text-left">
                    {arv.medicationSchedule
                      ? arv.medicationSchedule.split(",").map((t, i) => (
                          <span
                            key={i}
                            className="inline-block text-[10px] font-medium mr-1 mb-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800"
                          >
                            {t}
                          </span>
                        ))
                      : "Chưa có lịch"}
                  </td>
                  <td className="px-4 py-2 text-left max-w-[300px] break-words whitespace-pre-wrap">
                    {arv.description ?? ""}
                  </td>

                  {(role === "DOCTOR" || role === "ADMIN") && (
                    <td className="px-2 py-2 text-right relative">
                      {/* Nút mở menu */}
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full action-toggle-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId((prev) =>
                            prev === (arv.arvRegimenId || null)
                              ? null
                              : arv.arvRegimenId || null
                          );
                        }}
                      >
                        <MoreVertical size={18} className="text-gray-500" />
                      </button>

                      {/* Menu hành động */}
                      <div
                        className={`action-menu absolute right-0 w-36 bg-white border border-gray-200 rounded shadow-lg z-50 ${
                          openMenuId === arv.arvRegimenId ? "" : "hidden"
                        } ${
                          index === arvs.length - 1 ? "bottom-full mb-1" : "mt-1"
                        }`}
                      >
                        <button
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            setOpenMenuId(null);
                            setEditingId(arv.arvRegimenId || null);
                            setForm({ ...DEFAULT_FORM, ...arv });
                            setShowModal(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            setOpenMenuId(null);
                            handleDelete(arv.arvRegimenId);
                          }}
                        >
                          Xóa
                        </button>
                        <button
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            setOpenMenuId(null);
                            exportSingleToExcel(arv);
                          }}
                        >
                          Excel
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
        <span>
          Trang {currentPage} / {totalPages || 1} ({filteredArvs.length} phác đồ)
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1 || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 rounded border ${
              currentPage === 1 || totalPages === 0
                ? "bg-gray-200 text-gray-500"
                : "hover:bg-gray-100"
            }`}
          >
            ← Trước
          </button>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-200 text-gray-500"
                : "hover:bg-gray-100"
            }`}
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
}