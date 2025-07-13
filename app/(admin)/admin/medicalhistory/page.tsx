"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

type MedicalHistory = {
  medicalHistoryId: number;
  customerID: number | null;
  customerName?: string;
  doctorId: number;
  doctorName: string;
  diseaseName: string;
  visitDate: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
};

type Doctor = {
  doctorId: number;
  fullName: string;
};

type Customer = {
  customerID: number;
  fullName: string;
};

export default function MedicalHistoryTable() {
  const [data, setData] = useState<MedicalHistory[]>([]);
  const [filteredData, setFilteredData] = useState<MedicalHistory[]>([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<MedicalHistory | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Lấy danh sách hồ sơ, bác sĩ và bệnh nhân
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [histories, doctorsData, customersData] = await Promise.all([
          ApiService.getMedicalHistories(),
          ApiService.getAllDoctors(),
          ApiService.getAllCustomers(),
        ]);
        setData(histories);
        setFilteredData(histories);
        setDoctors(doctorsData);
        setCustomers(customersData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc theo tên bệnh nhân
  useEffect(() => {
    const lowerSearch = searchName.toLowerCase();
    const filtered = data.filter((item) =>
      item.customerName?.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
  }, [searchName, data]);

  // Định dạng ngày
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  // Mở modal sửa
  const openModal = (item: MedicalHistory) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  // Xử lý submit form (chỉ sửa)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await ApiService.updateMedicalHistory(formData.medicalHistoryId, formData);
      setIsModalOpen(false);
      const histories = await ApiService.getMedicalHistories();
      setData(histories);
      setFilteredData(histories);
    } catch (err) {
      setError("Lỗi khi cập nhật hồ sơ bệnh.");
    }
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa hồ sơ này?")) {
      try {
        await ApiService.deleteMedicalHistory(id);
        const histories = await ApiService.getMedicalHistories();
        setData(histories);
        setFilteredData(histories);
      } catch (err) {
        setError("Lỗi khi xóa hồ sơ bệnh.");
      }
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-blue-700">Lịch sử khám bệnh</h1>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Tìm theo tên bệnh nhân..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
          <table className="min-w-[1200px] w-full text-sm text-gray-700 border border-gray-300">
            <thead className="bg-blue-100 text-blue-800 text-sm font-semibold uppercase tracking-wide border-b border-gray-300">
              <tr>
                <th className="border border-gray-300 px-4 py-3">ID</th>
                <th className="border border-gray-300 px-4 py-3">Bệnh nhân</th>
                <th className="border border-gray-300 px-4 py-3">Bác sĩ</th>
                <th className="border border-gray-300 px-4 py-3">Tên bệnh</th>
                <th className="border border-gray-300 px-4 py-3">Ngày khám</th>
                <th className="border border-gray-300 px-4 py-3">Chẩn đoán</th>
                <th className="border border-gray-300 px-4 py-3">Đơn thuốc</th>
                <th className="border border-gray-300 px-4 py-3">Ghi chú</th>
                <th className="border border-gray-300 px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-6 text-gray-500 border">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.medicalHistoryId}
                    className={index % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-gray-50 hover:bg-blue-50"}
                  >
                    <td className="border border-gray-300 px-4 py-2">{item.medicalHistoryId}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.customerName ?? "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2 text-blue-700 font-medium">{item.doctorName}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.diseaseName}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(item.visitDate)}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.diagnosis}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.prescription}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.notes}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => openModal(item)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md mr-2 hover:bg-yellow-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.medicalHistoryId)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    onClick={() => setIsModalOpen(false)}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Chỉnh sửa hồ sơ bệnh án
      </h2>

      <form
  onSubmit={handleSubmit}
  className="grid grid-cols-1 md:grid-cols-2 gap-6"
>
  {/* Bệnh nhân */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh nhân</label>
    <select
      name="customerID"
      value={formData?.customerID || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">-- Chọn bệnh nhân --</option>
      {customers.map((c) => (
        <option key={c.customerID} value={c.customerID}>{c.fullName}</option>
      ))}
    </select>
  </div>

  {/* Bác sĩ */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</label>
    <select
      name="doctorId"
      value={formData?.doctorId || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">-- Chọn bác sĩ --</option>
      {doctors.map((d) => (
        <option key={d.doctorId} value={d.doctorId}>{d.fullName}</option>
      ))}
    </select>
  </div>

  {/* Tên bệnh */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Tên bệnh</label>
    <input
      type="text"
      name="diseaseName"
      value={formData?.diseaseName || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  {/* Ngày khám */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
    <input
      type="date"
      name="visitDate"
      value={formData?.visitDate?.split("T")[0] || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  {/* Chẩn đoán */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán</label>
    <input
      type="text"
      name="diagnosis"
      value={formData?.diagnosis || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  {/* Đơn thuốc */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn thuốc</label>
    <textarea
      name="prescription"
      value={formData?.prescription || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  {/* Ghi chú */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
    <textarea
      name="notes"
      value={formData?.notes || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  {/* Nút hành động */}
  <div className="md:col-span-2 flex justify-end space-x-4 mt-2">
    <button
      type="button"
      onClick={() => setIsModalOpen(false)}
      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
    >
      Hủy
    </button>
    <button
      type="submit"
      className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
    >
      Cập nhật
    </button>
  </div>
</form>

    </div>
  </div>
)}


    </div>
  );
}