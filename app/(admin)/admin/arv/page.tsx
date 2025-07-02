
"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

const defaultForm: ARVRegimen = {
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

export default function ARVRegimenPage() {
  const [arvs, setArvs] = useState<ARVRegimen[]>([]);
  const [form, setForm] = useState<ARVRegimen>({ ...defaultForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [role, setRole] = useState<string>("");
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("authData");
    if (stored && stored.trim() !== "") {
      try {
        const authData = JSON.parse(stored);
        const userRole = authData?.account?.role || authData?.role || "";
        setRole(userRole);

        if (userRole === "DOCTOR") {
          setDoctorId(authData?.doctor?.doctorId || null);
        }
      } catch (err) {
        console.warn("Lỗi phân tích authData:", err);
        setRole("");
        setDoctorId(null);
      }
    } else {
      console.warn("authData không tồn tại hoặc rỗng trong localStorage");
      setRole("");
      setDoctorId(null);
    }
  }, []);

  useEffect(() => {
    if (role === "DOCTOR" && doctorId !== null) {
      fetchARVs();
    } else if (role !== "DOCTOR") {
      fetchARVs();
    }
  }, [doctorId, role]);

  const fetchARVs = async () => {
    try {
      const data = await ApiService.getARVRegimens();

      if (!Array.isArray(data)) {
        console.error("❌ Dữ liệu không phải là mảng:", data);
        setArvs([]);
        return;
      }

      if (role === "DOCTOR" && doctorId !== null) {
        const filtered = data.filter((arv) => arv.doctorId === doctorId);
        setArvs(filtered);
      } else {
        setArvs(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải ARVs:", err);
      setArvs([]);
    }
  };

  const fetchCustomerByEmail = async (email: string) => {
    try {
      const customer = await ApiService.getCustomerByEmail(email);
      setForm((prev) => ({
        ...prev,
        customerName: customer.fullName || "",
        customerId: customer.customerID,
      }));
    } catch (err) {
      console.warn("Không tìm thấy bệnh nhân:", err);
      setForm((prev) => ({ ...prev, customerId: null, customerName: "" }));
    }
  };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    const list = form.medicationSchedule ? form.medicationSchedule.split(",") : [];
    const updated = checked ? [...list, value] : list.filter((item) => item !== value);
    setForm((prev) => ({ ...prev, medicationSchedule: updated.join(",") }));
  };

  const resetForm = () => {
    setForm({ ...defaultForm });
    setEditingId(null);
    setShowModal(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const stored = localStorage.getItem("authData");
      if (!stored || stored.trim() === "")
        throw new Error("authData không tồn tại hoặc rỗng");

      const authData = JSON.parse(stored);
      const payload = {
        ...form,
        doctorId: authData?.doctor?.doctorId,
        ...(editingId && { arvRegimenId: editingId }),
      };

      if (editingId) {
        await ApiService.updateARVWithHistory(payload);
        toast.success("✅ Cập nhật phác đồ thành công!", {
          icon: "✅",
          style: {
            borderRadius: "8px",
            background: "#f0fdf4",
            color: "#065f46",
          },
        });
      } else {
        await ApiService.createARVWithHistory(payload);
        toast.success("🎉 Tạo mới phác đồ thành công!", {
          icon: "🎉",
          style: {
            borderRadius: "8px",
            background: "#e0f2fe",
            color: "#1e3a8a",
          },
        });
      }
      fetchARVs();
      resetForm();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      toast.error("❌ Có lỗi xảy ra khi lưu dữ liệu!", {
        icon: "❌",
        style: {
          borderRadius: "8px",
          background: "#fee2e2",
          color: "#991b1b",
        },
      });
    }
  };

  const handleEdit = (arv: ARVRegimen) => {
    setForm({ ...defaultForm, ...arv });
    setEditingId(arv.arvRegimenId || null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa?")) {
      try {
        await ApiService.deleteARVRegimen(id);
        toast.success("🗑️ Xóa phác đồ thành công!", {
          icon: "🗑️",
          style: {
            borderRadius: "8px",
            background: "#fef9c3",
            color: "#92400e",
          },
        });
        fetchARVs();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        toast.error("❌ Không thể xóa phác đồ!", {
          icon: "❌",
          style: {
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
          },
        });
      }
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

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `arv_regimen_${arv.arvRegimenId}.xlsx`);
  };

  return (
    <div className="p-6 text-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Quản lý phác đồ ARV
      </h1>

      {(role === "DOCTOR" || role == "ADMIN") && (
        <div className="mb-6 text-right">
          <button
            onClick={handleAddNew}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm transition duration-200 ease-in-out"
          >
            Thêm
          </button>
        </div>
      )}

      {showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    onClick={resetForm}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full overflow-visible"
      onClick={(e) => e.stopPropagation()} // Ngăn click trong form đóng modal
    >

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? "Cập nhật Phác đồ ARV" : "Thêm Phác đồ ARV Mới"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Email bệnh nhân
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  onBlur={(e) => fetchCustomerByEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="customerName"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Tên bệnh nhân
                </label>
                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="createDate"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Ngày bắt đầu
                </label>
                <input
                  id="createDate"
                  type="date"
                  name="createDate"
                  value={form.createDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Ngày kết thúc
                </label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="regimenCode"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Mã phác đồ
                </label>
                <select
                  id="regimenCode"
                  name="regimenCode"
                  value={form.regimenCode}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                >
                  <option value="">-- Chọn mã --</option>
                  {ARV_REGIMEN_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="regimenName"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Tên phác đồ
                </label>
                <input
                  id="regimenName"
                  type="text"
                  name="regimenName"
                  value={form.regimenName}
                  readOnly
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi chú
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              <div className="col-span-1 md:col-span-2 font-semibold text-gray-900 mt-4 mb-2">
                Thông tin bệnh lý
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="diseaseName"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Tên bệnh
                </label>
                <input
                  id="diseaseName"
                  type="text"
                  name="diseaseName"
                  value={form.diseaseName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="diagnosis"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Chẩn đoán
                </label>
                <input
                  id="diagnosis"
                  type="text"
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col">
                <label
                  htmlFor="prescription"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Đơn thuốc
                </label>
                <input
                  id="prescription"
                  type="text"
                  name="prescription"
                  value={form.prescription}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col">
              <label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700 mb-1"
              >
    `         Ghi chú bệnh lý
              </label>
              <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes || ""}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-semibold text-gray-900">
                Lịch uống:
              </label>
              <div className="flex flex-wrap gap-4 text-gray-700">
                {DOSAGE_OPTIONS.map((time) => (
                  <label key={time} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={time}
                      checked={form.medicationSchedule.includes(time)}
                      onChange={handleDosageChange}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    {time}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm transition duration-200 ease-in-out"
              >
                {editingId ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-md shadow-sm transition duration-200 ease-in-out"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800 table-fixed border-collapse">
          <thead className="bg-blue-100 text-blue-800 uppercase text-sm font-semibold border-b border-gray-300">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Bác sĩ</th>
              <th className="border border-gray-300 px-4 py-2">Bệnh nhân</th>
              <th className="border border-gray-300 px-4 py-2">Ngày bắt đầu</th>
              <th className="border border-gray-300 px-4 py-2">Ngày kết thúc</th>
              <th className="border border-gray-300 px-4 py-2">Mã</th>
              <th className="border border-gray-300 px-4 py-2">Phác đồ</th>
              <th className="border border-gray-300 px-4 py-2">Lịch uống</th>
              <th className="border border-gray-300 px-4 py-2">Ghi chú</th>
              {role === "DOCTOR" && (
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              )}
            </tr>
          </thead>
          <tbody>
            {arvs.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "DOCTOR" ? 10 : 9}
                  className="text-center text-gray-500 py-6 border"
                >
                  Không có dữ liệu phác đồ ARV nào.
                </td>
              </tr>
            ) : (
              arvs.map((arv, index) => (
                <tr
                  key={arv.arvRegimenId}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-blue-50"
                      : "bg-gray-50 hover:bg-blue-50"
                  }
                >
                  <td className="border border-gray-300 px-4 py-2 text-center">{arv.arvRegimenId}</td>
                  <td className="border border-gray-300 px-4 py-2">{arv.doctorName}</td>
                  <td className="border border-gray-300 px-4 py-2">{arv.customerName}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{arv.createDate}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{arv.endDate}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{arv.regimenCode}</td>
                  <td className="border border-gray-300 px-4 py-2">{arv.regimenName}</td>
                  <td className="border border-gray-300 px-4 py-2">{arv.medicationSchedule}</td>
                  <td className="border border-gray-300 px-4 py-2 max-w-[200px] break-all whitespace-normal overflow-hidden text-ellipsis">
  {arv.description}
</td>

                  {(role === "DOCTOR"|| role === "ADMIN") && (
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-sm font-medium shadow-sm transition"
                        onClick={() => handleEdit(arv)}
                      >
                        Sửa
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-sm font-medium shadow-sm transition"
                        onClick={() => handleDelete(arv.arvRegimenId!)}
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() => exportSingleToExcel(arv)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 rounded text-sm font-medium shadow-sm transition"
                      >
                        Excel
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
