"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

type ARVRegimen = {
  arvRegimenId?: number;
  doctorId?: number;
  doctorName?: string;
  customerId?: number;
  customerName: string;
  createDate: string;
  endDate: string;
  regimenName: string;
  regimenCode: string;
  description: string;
  medicationSchedule: string;
  duration: number;
  email?: string;
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

  useEffect(() => {
    fetchARVs();
    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    setRole(authData?.role || "");

    if (authData?.doctor?.doctorId) {
      setForm((prev) => ({ ...prev, doctorId: authData.doctor.doctorId }));
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (form.email) {
        fetchCustomerByEmail(form.email);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [form.email]);

  const fetchARVs = async () => {
    try {
      const data = await ApiService.getARVRegimens();
      setArvs(data);
    } catch (err) {
      console.error("Lỗi khi tải ARVs:", err);
    }
  };

  const fetchCustomerByEmail = async (email: string) => {
    try {
      const customer = await ApiService.getCustomerByEmail(email);
      setForm((prev) => ({
        ...prev,
        customerName: customer.fullName || "",
        customerId: customer.customerId,
      }));
    } catch (err) {
      console.error("Không tìm thấy bệnh nhân:", err);
      setForm((prev) => ({
        ...prev,
        customerName: "",
        customerId: undefined,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) : value,
      ...(name === "regimenCode" && {
        regimenName: ARV_REGIMEN_OPTIONS.find((o) => o.code === value)?.name || "",
      }),
    }));
  };

  const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const list = form.medicationSchedule ? form.medicationSchedule.split(",") : [];
    const updated = checked ? [...list, value] : list.filter((item) => item !== value);
    setForm((prev) => ({ ...prev, medicationSchedule: updated.join(",") }));
  };

  const handleSubmit = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const payload = { ...form, doctorId: authData?.doctor?.doctorId };
      if (editingId) {
        await ApiService.updateARVRegimen(editingId, payload);
      } else {
        await ApiService.createARVRegimen(payload);
      }
      fetchARVs();
      resetForm();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    }
  };

  const handleEdit = (arv: ARVRegimen) => {
    setForm({
      ...defaultForm,
      ...arv,
      email: "",
      customerName: arv.customerName || "",
      medicationSchedule: arv.medicationSchedule || "",
      description: arv.description || "",
      createDate: arv.createDate || "",
      endDate: arv.endDate || "",
      duration: arv.duration || 1,
    });
    setEditingId(arv.arvRegimenId || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa?")) {
      try {
        await ApiService.deleteARVRegimen(id);
        fetchARVs();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };

  const resetForm = () => {
    setForm({ ...defaultForm });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý phác đồ ARV</h1>

      {role === "DOCTOR" && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email bệnh nhân"
              value={form.email || ""}
              onChange={handleChange}
              className="border p-2"
            />
            <input
              type="text"
              name="customerName"
              placeholder="Tên bệnh nhân"
              value={form.customerName}
              readOnly
              className="border p-2 bg-gray-100"
            />
            <input
              type="date"
              name="createDate"
              value={form.createDate}
              onChange={handleChange}
              className="border p-2"
            />
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="border p-2"
            />
            <select
              name="regimenCode"
              value={form.regimenCode}
              onChange={handleChange}
              className="border p-2"
            >
              <option value="">Chọn mã phác đồ</option>
              {ARV_REGIMEN_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="regimenName"
              value={form.regimenName}
              readOnly
              className="border p-2 bg-gray-100"
            />
            <input
              type="text"
              name="description"
              placeholder="Ghi chú"
              value={form.description}
              onChange={handleChange}
              className="border p-2"
            />
          </div>
          <div className="mt-3">
            <label className="block mb-1 font-semibold">Lịch uống:</label>
            <div className="flex gap-4">
              {DOSAGE_OPTIONS.map((time) => (
                <label key={time}>
                  <input
                    type="checkbox"
                    value={time}
                    checked={form.medicationSchedule.includes(time)}
                    onChange={handleDosageChange}
                    className="mr-1"
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              {editingId ? "Cập nhật" : "Thêm"}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Bác sĩ</th>
            <th className="border px-2 py-1">Bệnh nhân</th>
            <th className="border px-2 py-1">Ngày bắt đầu</th>
            <th className="border px-2 py-1">Ngày kết thúc</th>
            <th className="border px-2 py-1">Mã</th>
            <th className="border px-2 py-1">Tên phác đồ</th>
            <th className="border px-2 py-1">Lịch uống</th>
            <th className="border px-2 py-1">Ghi chú</th>
            {role === "DOCTOR" && <th className="border px-2 py-1">Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {arvs.map((arv) => (
            <tr key={arv.arvRegimenId} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{arv.arvRegimenId}</td>
              <td className="border px-2 py-1">{arv.doctorName}</td>
              <td className="border px-2 py-1">{arv.customerName}</td>
              <td className="border px-2 py-1">{arv.createDate}</td>
              <td className="border px-2 py-1">{arv.endDate}</td>
              <td className="border px-2 py-1">{arv.regimenCode}</td>
              <td className="border px-2 py-1">{arv.regimenName}</td>
              <td className="border px-2 py-1">{arv.medicationSchedule}</td>
              <td className="border px-2 py-1">{arv.description}</td>
              {role === "DOCTOR" && (
                <td className="border px-2 py-1">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => handleEdit(arv)}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(arv.arvRegimenId!)}
                  >
                    Xóa
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}