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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    setCurrentPage(1);
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
      await ApiService.updateMedicalHistory(
        formData.medicalHistoryId,
        formData
      );
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
    if (window.confirm("Bạn có chắc muốn xóa hồ sơ này?")) {
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginated = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 py-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 sm:p-10 space-y-8 border border-blue-100">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold italic text-blue-900 font-sans mb-2 tracking-tight drop-shadow-md">
            Lịch sử khám bệnh
          </h1>
          <p className="text-gray-500 text-sm">
            Xem, chỉnh sửa và quản lý hồ sơ bệnh án
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên bệnh nhân..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          <span className="text-gray-600 text-sm mt-2 md:mt-0">
            Tổng: {filteredData.length} hồ sơ
          </span>
        </div>
        {loading ? (
          <div className="text-center py-6 text-gray-600">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-xl border border-black bg-white">
            <table className="min-w-full text-base text-gray-700">
              <thead className="bg-blue-100 text-blue-900 uppercase tracking-wider text-sm">
                <tr>
                  <th className="border border-black px-4 py-3">ID</th>
                  <th className="border border-black px-4 py-3">Bệnh nhân</th>
                  <th className="border border-black px-4 py-3">Bác sĩ</th>
                  <th className="border border-black px-4 py-3">Tên bệnh</th>
                  <th className="border border-black px-4 py-3">Ngày khám</th>
                  <th className="border border-black px-4 py-3">Chẩn đoán</th>
                  <th className="border border-black px-4 py-3">Đơn thuốc</th>
                  <th className="border border-black px-4 py-3">Ghi chú</th>
                  <th className="border border-black px-4 py-3 text-center">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-6 text-gray-400 border border-black"
                    >
                      Không có dữ liệu.
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, index) => (
                    <tr
                      key={item.medicalHistoryId}
                      className={
                        index % 2 === 0
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "bg-white hover:bg-blue-100"
                      }
                    >
                      <td className="border border-black px-4 py-2">
                        {item.medicalHistoryId}
                      </td>
                      <td className="border border-black px-4 py-2 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">
                        {item.customerName ?? "N/A"}
                      </td>
                      <td className="border border-black px-4 py-2 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis text-blue-700 font-medium">
                        {item.doctorName}
                      </td>
                      <td className="border border-black px-4 py-2">
                        {item.diseaseName}
                      </td>
                      <td className="border border-black px-4 py-2">
                        {formatDate(item.visitDate)}
                      </td>
                      <td className="border border-black px-4 py-2">
                        {item.diagnosis}
                      </td>
                      <td className="border border-black px-4 py-2 whitespace-pre-wrap">
                        {item.prescription}
                      </td>
                      <td className="border border-black px-4 py-2 whitespace-pre-wrap">
                        {item.notes}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(item)}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(item.medicalHistoryId)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>
            Trang {currentPage} / {totalPages} ({filteredData.length} hồ sơ)
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              ← Trước
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              Sau →
            </button>
          </div>
        </div>
        {/* Modal sửa */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bệnh nhân
                  </label>
                  <select
                    name="customerID"
                    value={formData?.customerID || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">-- Chọn bệnh nhân --</option>
                    {customers.map((c) => (
                      <option key={c.customerID} value={c.customerID}>
                        {c.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bác sĩ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bác sĩ
                  </label>
                  <select
                    name="doctorId"
                    value={formData?.doctorId || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {doctors.map((d) => (
                      <option key={d.doctorId} value={d.doctorId}>
                        {d.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tên bệnh */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên bệnh
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày khám
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chẩn đoán
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn thuốc
                  </label>
                  <textarea
                    name="prescription"
                    value={formData?.prescription || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Ghi chú */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
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
    </div>
  );
}
