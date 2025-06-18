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

  const fetchTestResults = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const doctorId = authData?.doctor?.doctorId;
      const currentRole = authData?.role;
      const customerEmail = authData?.email;
      setRole(currentRole);

      let results: TestResult[] = [];
   if (currentRole === "DOCTOR") {
  results = await ApiService.getTestResultsByDoctorId(doctorId);
} else if (currentRole === "USER") {
  results = await ApiService.getMyTestResults();
} else {
  results = await ApiService.getTestResults(); // dành cho ADMIN
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
      {(role === "DOCTOR" || role === "ADMIN") && (
        <>
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

          <div className="flex gap-2 mb-6">
            <button
              onClick={handleCreateOrUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </>
      )}

      <table className="w-full border table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Email bệnh nhân</th>
            <th className="border p-2">Tên bệnh nhân</th>
            <th className="border p-2">Tên bác sĩ</th>
            <th className="border p-2">Ngày</th>
            <th className="border p-2">Loại</th>
            <th className="border p-2">Kết quả</th>
            {(role === "DOCTOR" || role === "ADMIN") && (
              <th className="border p-2">Hành động</th>
            )}
          </tr>
        </thead>
        <tbody>
          {testResults.map((tr) => (
            <tr key={tr.testResultId}>
              <td className="border p-2">{tr.customerEmail}</td>
              <td className="border p-2">{tr.customerName}</td>
              <td className="border p-2">{tr.doctorName}</td>
              <td className="border p-2">{format(new Date(tr.date), "dd/MM/yyyy")}</td>
              <td className="border p-2">{tr.typeOfTest}</td>
              <td className="border p-2">{tr.resultDescription}</td>
              {(role === "DOCTOR" || role === "ADMIN") && (
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(tr)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(tr.testResultId)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
