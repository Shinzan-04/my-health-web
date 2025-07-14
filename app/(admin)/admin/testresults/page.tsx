"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { MoreVertical } from "lucide-react";

type TestResult = {
  testResultId: number | undefined;   // ← cho phép undefined ở trạng thái form
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
  const itemsPerPage = 10
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const toggleSelect = (id?: number) => {
    if (id == null) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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


  const fetchTestResults = async () => {
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
      console.error("Lỗi khi tải kết quả xét nghiệm:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest(".action-menu") ||
        target.closest(".action-toggle-button")
      ) {
        return;
      }
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchTestResults();
  }, []);

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
      console.error("Không tìm thấy bệnh nhân:", error);
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
      console.error("Lỗi khi lưu kết quả xét nghiệm:", error);
      toast.error("Lỗi khi lưu kết quả xét nghiệm!", {
        icon: "❌",
        style: {
          borderRadius: "8px",
          background: "#fee2e2",
          color: "#991b1b",
        },
      });
    }
  };


  const handleEdit = (testResult: TestResult) => {
    setFormData({ ...testResult });
    setEditingId(testResult.testResultId || null);
    setShowForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xóa kết quả này không?")) return;

    try {
      await ApiService.deleteTestResult(id);
      await fetchTestResults();

      toast.success("Xóa kết quả thành công!", {
        icon: "🗑️",
        style: {
          borderRadius: "8px",
          background: "#fef9c3",
          color: "#92400e",
        },
      });

    } catch (error) {
      console.error("Lỗi khi xóa kết quả xét nghiệm:", error);
      toast.error("Không thể xóa kết quả!", {
        icon: "❌",
        style: {
          borderRadius: "8px",
          background: "#fee2e2",
          color: "#991b1b",
        },
      });
    }
  };

  const handleDeleteMultiple = async () => {
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} kết quả này không?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => ApiService.deleteTestResult(id)));
      await fetchTestResults();
      setSelectedIds([]);
      toast.success("Đã xóa các mục đã chọn!");
    } catch (error) {
      console.error("Lỗi khi xóa nhiều:", error);
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
    <div className="p-4 relative">
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={resetForm} // 👉 click ngoài sẽ đóng form
        >
          <div
            className="bg-white w-full max-w-3xl p-8 rounded-lg shadow-2xl border border-gray-300 relative"
            onClick={(e) => e.stopPropagation()} // 👉 ngăn click trong form bị lan ra ngoài
          >

            {/* Nút đóng */}
            <button
              onClick={resetForm}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              {editingId ? "Chỉnh sửa kết quả xét nghiệm" : "Thêm kết quả xét nghiệm mới"}
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6 text-gray-700">
  {/* Email bệnh nhân */}
  <div className="mb-2">
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
  <div className="mb-2">
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
  <div className="mb-2">
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
  <div className="mb-2">
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
  <div className="col-span-2 mb-2">
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
      {/* ---------- PAGE HEADER ---------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Tiêu đề trang */}
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý kết quả xét nghiệm
        </h1>

        {/* Ô tìm kiếm + các nút thao tác */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center text-gray-700">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên bệnh nhân, bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-80"
          />

          {(role === "DOCTOR" || role === "ADMIN") && (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm"
              >
                Thêm
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={handleDeleteMultiple}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm"
                >
                  Xóa {selectedIds.length} mục
                </button>
              )}
            </>
          )}
        </div>
      </div>



      <div className="relative bg-white rounded-lg shadow">
        <table className="w-full min-w-[1200px] text-sm border-collapse bg-white">
          <thead className="text-gray-800 text-sm font-semibold uppercase tracking-wide bg-white border-b border-gray-300">

            <tr>
              <th className="px-3 py-2 text-center w-8">
                <input
                  type="checkbox"
                  className="appearance-none h-4 w-4 rounded bg-gray-200 checked:bg-blue-500 focus:outline-none"
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
              <th className="px-2 py-2 text-center w-16">ID</th>
              <th className="px-4 py-2 text-left w-48">Tên bệnh nhân</th>
              <th className="px-4 py-2 text-left w-48">Tên bác sĩ</th>
              <th
                className="px-3 py-2 text-center w-32 cursor-pointer hover:text-blue-700"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                Ngày {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th className="px-4 py-2 text-left w-40">Loại xét nghiệm</th>
              <th className="px-4 py-2 text-left w-[400px]">Kết quả mô tả</th>
              <th className="px-2 py-2 text-right w-12"></th>
            </tr>
          </thead>

          <tbody>
            {paginatedResults.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-6">
                  Không có dữ liệu.
                </td>
              </tr>
            ) : (
              paginatedResults.map((tr, index) => (
                <tr
                  key={tr.testResultId ?? `row-${index}`}
                  className={`transition ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                >

                  <td className="px-3 py-2 text-center text-gray-700">
                    <input
                      type="checkbox"
                      className="appearance-none h-4 w-4 rounded bg-gray-200 checked:bg-blue-500 focus:outline-none"
                      checked={selectedIds.includes(tr.testResultId ?? -1)}
                      onChange={() => toggleSelect(tr.testResultId)}
                    />
                  </td>
                  <td className="px-2 py-2 text-center text-gray-700">{tr.testResultId}</td>
                  <td className="px-4 py-2 text-left truncate max-w-[200px] text-gray-700">{tr.customerName}</td>
                  <td className="px-4 py-2 text-left truncate max-w-[200px] text-gray-700">{tr.doctorName}</td>
                  <td className="px-3 py-2 text-center text-gray-700">
                    {format(new Date(tr.date), "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-700">{tr.typeOfTest}</td>
                  <td className="px-4 py-2 text-left text-gray-700">
                    <div className="whitespace-pre-wrap break-words">
                      {tr.resultDescription}
                    </div>
                  </td>
                  <td className="text-right px-2 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const id = tr.testResultId ?? null;
                        setOpenMenuId((prev) => (prev === id ? null : id));
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full action-toggle-button"
                    >
                      <MoreVertical size={18} className="text-gray-500" />
                    </button>

                    <div
                      id={`action-menu-${tr.testResultId}`}
                      className={`action-menu absolute right-0 w-36 bg-white border border-gray-200 rounded shadow-lg z-50 ${openMenuId === tr.testResultId ? "" : "hidden"
                        } ${index === paginatedResults.length - 1 ? "bottom-full mb-1" : "mt-1"}`}
                    >

                      <button
                        onClick={() => {
                          handleEdit(tr);
                          document.getElementById(`action-menu-${tr.testResultId}`)?.classList.add("hidden");
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-blue-700"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(tr.testResultId);
                          document.getElementById(`action-menu-${tr.testResultId}`)?.classList.add("hidden");
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() => {
                          exportSingleToExcel(tr);
                          document.getElementById(`action-menu-${tr.testResultId}`)?.classList.add("hidden");
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-gray-700"
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

      <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
        <span>
          Trang {currentPage} / {totalPages} ({filteredResults.length} kết quả)
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-200 text-gray-500" : "hover:bg-gray-100"
              }`}
          >
            ← Trước
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className={`px-3 py-1 rounded border ${currentPage === totalPages ? "bg-gray-200 text-gray-500" : "hover:bg-gray-100"
              }`}
          >
            Sau →
          </button>
        </div>
      </div>

    </div>
  );
}
