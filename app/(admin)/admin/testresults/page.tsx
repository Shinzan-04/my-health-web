"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type TestResult = {
  testResultId?: number;
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
    } catch (error) {
      console.error("Lỗi khi lưu kết quả xét nghiệm:", error);
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
    } catch (error) {
      console.error("Lỗi khi xóa kết quả xét nghiệm:", error);
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
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Kết quả xét nghiệm</h1>

      {(role === "DOCTOR" || role === "ADMIN") && !showForm && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Thêm
          </button>
        </div>
      )}

      {showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-3xl p-8 rounded-lg shadow-2xl border border-gray-300 relative">
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

      <div className="grid grid-cols-2 gap-6 mb-6">
        <input
          type="text"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleEmailChange}
          placeholder="Email bệnh nhân"
          className="border p-3 rounded w-full"
        />
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Tên bệnh nhân"
          className="border p-3 rounded w-full bg-gray-100"
          readOnly
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />
        <input
          type="text"
          name="typeOfTest"
          value={formData.typeOfTest}
          onChange={handleChange}
          placeholder="Loại xét nghiệm"
          className="border p-3 rounded w-full"
        />
        <textarea
          name="resultDescription"
          value={formData.resultDescription}
          onChange={handleChange}
          placeholder="Kết quả mô tả"
          className="border p-3 rounded col-span-2 w-full"
          rows={4}
        />
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


      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200 mt-4">
        <table className="min-w-full text-sm text-gray-800 table-fixed border-collapse">
          <thead className="bg-blue-100 text-blue-800 uppercase text-sm font-semibold border-b border-gray-300">
            <tr>
              <th className="border px-4 py-2">Email bệnh nhân</th>
              <th className="border px-4 py-2">Tên bệnh nhân</th>
              <th className="border px-4 py-2">Tên bác sĩ</th>
              <th className="border px-4 py-2">Ngày</th>
              <th className="border px-4 py-2">Loại xét nghiệm</th>
              <th className="border px-4 py-2">Kết quả mô tả</th>
              {(role === "DOCTOR" || role === "ADMIN") && (
                <th className="border px-4 py-2">Hành động</th>
              )}
            </tr>
          </thead>
          <tbody>
            {testResults.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "DOCTOR" || role === "ADMIN" ? 7 : 6}
                  className="text-center text-gray-500 py-6 border"
                >
                  Không có kết quả xét nghiệm nào.
                </td>
              </tr>
            ) : (
              testResults.map((tr, index) => (
                <tr key={tr.testResultId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-4 py-2">{tr.customerEmail}</td>
                  <td className="border px-4 py-2">{tr.customerName}</td>
                  <td className="border px-4 py-2">{tr.doctorName}</td>
                  <td className="border px-4 py-2 text-center">
                    {format(new Date(tr.date), "dd/MM/yyyy")}
                  </td>
                  <td className="border px-4 py-2">{tr.typeOfTest}</td>
                  <td className="border px-4 py-2">{tr.resultDescription}</td>
                  {(role === "DOCTOR" || role === "ADMIN") && (
                    <td className="border px-4 py-2 text-center space-x-1">
                      <button
                        onClick={() => handleEdit(tr)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(tr.testResultId)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-sm"
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() => exportSingleToExcel(tr)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 rounded text-sm"
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
