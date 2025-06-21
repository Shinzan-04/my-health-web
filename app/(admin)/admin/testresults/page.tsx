"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { format } from "date-fns";

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Kết quả xét nghiệm
      </h1>
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


      {(role === "DOCTOR" || role === "ADMIN") && showForm && (
        <div className="mb-6 border border-gray-300 rounded p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Chỉnh sửa kết quả xét nghiệm" : "Thêm kết quả xét nghiệm mới"}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleEmailChange}
              placeholder="Email bệnh nhân"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Tên bệnh nhân"
              className="border p-2 rounded"
              readOnly
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="typeOfTest"
              value={formData.typeOfTest}
              onChange={handleChange}
              placeholder="Loại xét nghiệm"
              className="border p-2 rounded"
            />
            <textarea
              name="resultDescription"
              value={formData.resultDescription}
              onChange={handleChange}
              placeholder="Kết quả mô tả"
              className="border p-2 rounded col-span-2"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={handleCreateOrUpdate}
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
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800 table-fixed border-collapse">
          <thead className="bg-blue-100 text-blue-800 uppercase text-sm font-semibold border-b border-gray-300">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Email bệnh nhân</th>
              <th className="border border-gray-300 px-4 py-2">Tên bệnh nhân</th>
              <th className="border border-gray-300 px-4 py-2">Tên bác sĩ</th>
              <th className="border border-gray-300 px-4 py-2">Ngày</th>
              <th className="border border-gray-300 px-4 py-2">Loại xét nghiệm</th>
              <th className="border border-gray-300 px-4 py-2">Kết quả mô tả</th>
              {(role === "DOCTOR" || role === "ADMIN") && (
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
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
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(tr)}
                         className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(tr.testResultId)}
                         className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Xóa
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
