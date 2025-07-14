"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

type TestResult = {
  testResultId: number | undefined;
  doctorId?: number;
  doctorName?: string;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  date: string;
  typeOfTest: string;
  resultDescription: string;
};

export default function TestResultPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [formData, setFormData] = useState<TestResult>({
    testResultId: undefined,
    doctorId: undefined,
    customerId: 0,
    customerName: "",
    customerEmail: "",
    date: "",
    typeOfTest: "",
    resultDescription: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [role, setRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const toggleSelect = (id?: number) => {
    if (id == null) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchTestResults();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchTestResults = async () => {
    setLoading(true);
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const doctorId = authData?.doctor?.doctorId;
      const currentRole = authData?.role;
      setRole(currentRole);

      let results: TestResult[] = [];
      if (currentRole === "DOCTOR") {
        results = await ApiService.getTestResultsByDoctorId(doctorId);
      } else if (currentRole === "USER") {
        results = await ApiService.getMyTestResults();
      } else {
        results = await ApiService.getTestResults(); // ADMIN
      }

      setTestResults(results);
    } catch (error) {
      toast.error("Lỗi khi tải kết quả xét nghiệm!");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = testResults
    .filter((tr) => {
      return (
        tr.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tr.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tr.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, customerEmail: email });

    try {
      const customer = await ApiService.getCustomerByEmail(email);
      if (customer) {
        setFormData((prev) => ({
          ...prev,
          customerId: customer.customerId,
          customerName: customer.fullName || "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          customerId: 0,
          customerName: "",
        }));
      }
    } catch (error) {
      // ignore
    }
  };

  const resetForm = () => {
    setFormData({
      testResultId: undefined,
      doctorId: undefined,
      customerId: 0,
      customerName: "",
      customerEmail: "",
      date: "",
      typeOfTest: "",
      resultDescription: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleCreateOrUpdate = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const doctorId = authData?.doctor?.doctorId;

      const dto: TestResult = {
        ...formData,
        doctorId: editingId ? formData.doctorId : (role === "DOCTOR" ? doctorId : undefined),
      };

      if (editingId) {
        await ApiService.updateTestResult(editingId, dto);
      } else {
        await ApiService.createTestResult(dto);
      }

      await fetchTestResults();
      resetForm();

      toast.success(editingId ? "Cập nhật kết quả thành công!" : "Thêm mới kết quả thành công!", {
        icon: editingId ? "✅" : "🎉",
        style: {
          borderRadius: "8px",
          background: editingId ? "#f0fdf4" : "#e0f2fe",
          color: editingId ? "#065f46" : "#1e3a8a",
        },
      });

    } catch (error) {
      toast.error("Lỗi khi lưu kết quả xét nghiệm!");
    }
  };

  const handleEdit = (testResult: TestResult) => {
    setFormData({ ...testResult });
    setEditingId(testResult.testResultId || null);
    setShowForm(true);
  };

  const promptDelete = (id?: number) => {
    if (!id) return;
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await ApiService.deleteTestResult(confirmDeleteId);
      await fetchTestResults();
      toast.success("Xóa kết quả thành công!");
    } catch {
      toast.error("Không thể xóa kết quả!");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const handleDeleteMultiple = async () => {
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} kết quả này không?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => ApiService.deleteTestResult(id)));
      await fetchTestResults();
      setSelectedIds([]);
      toast.success("Đã xóa các mục đã chọn!");
    } catch {
      toast.error("Xóa nhiều thất bại!");
    }
  };

  const exportSingleToExcel = (tr: TestResult) => {
    const row = [{
      "Email bệnh nhân": tr.customerEmail,
      "Tên bệnh nhân": tr.customerName,
      "Tên bác sĩ": tr.doctorName,
      "Ngày": format(new Date(tr.date), "dd/MM/yyyy"),
      "Loại xét nghiệm": tr.typeOfTest,
      "Kết quả mô tả": tr.resultDescription,
    }];

    const worksheet = XLSX.utils.json_to_sheet(row);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kết quả");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });

    const filename = `ket_qua_${tr.customerName?.replaceAll(" ", "_") || "xet_nghiem"}.xlsx`;
    saveAs(file, filename);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 py-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 sm:p-10 space-y-8 border border-blue-100">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold italic text-blue-900 font-sans mb-2 tracking-tight drop-shadow-md">
            Quản lý kết quả xét nghiệm
          </h1>
          <p className="text-gray-500 text-sm">Xem, thêm, chỉnh sửa và quản lý kết quả xét nghiệm</p>
        </div>
        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên bệnh nhân, bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          <div className="flex gap-2">
            {(role === "DOCTOR" || role === "ADMIN") && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm"
              >
                Thêm
              </button>
            )}
            {(role === "DOCTOR" || role === "ADMIN") && selectedIds.length > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm"
              >
                Xóa {selectedIds.length} mục
              </button>
            )}
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-black bg-white">
          <table className="min-w-full text-base text-gray-700 border-separate border-spacing-0">
            <thead className="bg-blue-100 text-blue-900 uppercase tracking-wider text-sm">
              <tr>
                <th className="px-3 py-2 text-center w-8 border border-black">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                    checked={
                      paginatedResults.every((tr) => tr.testResultId != null && selectedIds.includes(tr.testResultId))
                      && paginatedResults.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const ids = paginatedResults
                          .map((tr) => tr.testResultId)
                          .filter((id): id is number => id != null);
                        setSelectedIds(ids);
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </th>
                <th className="px-2 py-2 text-center w-16 border border-black">ID</th>
                <th className="px-4 py-2 text-left w-48 border border-black">Tên bệnh nhân</th>
                <th className="px-4 py-2 text-left w-48 border border-black">Tên bác sĩ</th>
                <th
                  className="px-3 py-2 text-center w-32 cursor-pointer hover:text-blue-700 border border-black"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  Ngày {sortOrder === "asc" ? "↑" : "↓"}
                </th>
                <th className="px-4 py-2 text-left w-40 border border-black">Loại xét nghiệm</th>
                <th className="px-4 py-2 text-left w-[400px] border border-black">Kết quả mô tả</th>
                <th className="px-2 py-2 text-center w-32 border border-black">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500 border border-black">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6 border border-black">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                paginatedResults.map((tr, index) => (
                  <tr
                    key={tr.testResultId ?? `row-${index}`}
                    className={`transition ${index % 2 === 0 ? "bg-blue-50" : "bg-white"} hover:bg-blue-100`}
                  >
                    <td className="px-3 py-2 text-center text-gray-700 border border-black">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(tr.testResultId ?? -1)}
                        onChange={() => toggleSelect(tr.testResultId)}
                      />
                    </td>
                    <td className="px-2 py-2 text-center text-gray-700 border border-black">{tr.testResultId}</td>
                    <td className="px-4 py-2 text-left truncate max-w-[200px] text-gray-700 border border-black">{tr.customerName}</td>
                    <td className="px-4 py-2 text-left truncate max-w-[200px] text-gray-700 border border-black">{tr.doctorName}</td>
                    <td className="px-3 py-2 text-center text-gray-700 border border-black">
                      {format(new Date(tr.date), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-700 border border-black">{tr.typeOfTest}</td>
                    <td className="px-4 py-2 text-left text-gray-700 border border-black">
                      <div className="whitespace-pre-wrap break-words">
                        {tr.resultDescription}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center border border-black">
                      <div className="flex justify-center gap-2">
                        <button
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          onClick={() => handleEdit(tr)}
                        >
                          Sửa
                        </button>
                        <button
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          onClick={() => promptDelete(tr.testResultId)}
                        >
                          Xóa
                        </button>
                        <button
                          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          onClick={() => exportSingleToExcel(tr)}
                        >
                          Excel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>
            Trang {currentPage} / {totalPages} ({filteredResults.length} kết quả)
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              ← Trước
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              Sau →
            </button>
          </div>
        </div>
        {/* Modal Form */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={resetForm}
          >
            <div
              className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl border border-gray-300 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={resetForm}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
                {editingId ? "Chỉnh sửa kết quả xét nghiệm" : "Thêm kết quả xét nghiệm mới"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-700">
                {/* Email bệnh nhân */}
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">
                    Email bệnh nhân
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleEmailChange}
                    placeholder="Email bệnh nhân"
                    className="border p-3 rounded w-full text-gray-700"
                    required
                  />
                </div>
                {/* Tên bệnh nhân */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                    Tên bệnh nhân
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Tên bệnh nhân"
                    className="border p-3 rounded w-full bg-gray-100 text-gray-700"
                    readOnly
                  />
                </div>
                {/* Ngày */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Ngày xét nghiệm
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border p-3 rounded w-full text-gray-700"
                    required
                  />
                </div>
                {/* Loại xét nghiệm */}
                <div>
                  <label htmlFor="typeOfTest" className="block text-sm font-medium mb-1">
                    Loại xét nghiệm
                  </label>
                  <input
                    type="text"
                    id="typeOfTest"
                    name="typeOfTest"
                    value={formData.typeOfTest}
                    onChange={handleChange}
                    placeholder="Loại xét nghiệm"
                    className="border p-3 rounded w-full text-gray-700"
                    required
                  />
                </div>
                {/* Kết quả mô tả */}
                <div className="md:col-span-2">
                  <label htmlFor="resultDescription" className="block text-sm font-medium mb-1">
                    Kết quả mô tả
                  </label>
                  <textarea
                    id="resultDescription"
                    name="resultDescription"
                    value={formData.resultDescription}
                    onChange={handleChange}
                    placeholder="Kết quả mô tả"
                    className="border p-3 rounded w-full text-gray-700"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCreateOrUpdate}
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
        {/* Confirm Delete Modal */}
        {confirmDeleteId !== null && (
          <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-80 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Xác nhận xóa</h2>
              <p className="mb-6 text-gray-700">Bạn có chắc chắn muốn xóa kết quả này?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded border hover:bg-gray-100 text-gray-700"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
