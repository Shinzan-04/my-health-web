"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import moment from "moment";

type TestResult = {
  testResultId?: number;
  doctorId: number;
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
    doctorId: 0,
    customerId: 0,
    customerName: "",
    customerEmail: "",
    date: "",
    typeOfTest: "",
    resultDescription: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);

  useEffect(() => {
    fetchTestResults();

    const authData = localStorage.getItem("authData");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const doctorId = parsed?.doctor?.doctorId;
        const role = parsed?.account?.role || parsed?.role;
        if (doctorId) {
          setFormData((prev) => ({ ...prev, doctorId }));
        }
        if (role === "DOCTOR") {
          setIsDoctor(true);
        }
      } catch (err) {
        console.error("Lỗi khi xử lý authData:", err);
      }
    }
  }, []);

  const fetchTestResults = async () => {
    try {
      const data = await ApiService.getTestResults();
      setTestResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi fetch test results", err);
      setTestResults([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailBlur = async () => {
    if (formData.customerEmail) {
      try {
        const customer = await ApiService.getCustomerByEmail(formData.customerEmail);
        console.log("📥 API trả về:", customer);

        const customerId = customer.customerId ?? customer.customerID;

        if (customer && customerId) {
          setFormData((prev) => ({
            ...prev,
            customerId,
            customerName: customer.fullName,
          }));
        } else {
          alert("Không tìm thấy bệnh nhân với email này.");
          setFormData((prev) => ({
            ...prev,
            customerId: 0,
            customerName: "",
          }));
        }
      } catch (error) {
        console.error("Lỗi khi tìm khách hàng theo email", error);
      }
    }
  };

  const handleSubmit = async () => {
  try {
    await handleEmailBlur();

    const dataToSubmit = { ...formData };
    if (!editingId) delete dataToSubmit.testResultId;

    if (!dataToSubmit.customerId) {
      alert("Vui lòng nhập đúng email để tìm bệnh nhân.");
      return;
    }

    if (editingId) {
      await ApiService.updateTestResult(editingId, dataToSubmit);
    } else {
      await ApiService.createTestResult(dataToSubmit);
    }

    await fetchTestResults(); // ✅ Đảm bảo reload dữ liệu mới nhất
    resetForm();
  } catch (error) {
    console.error("Lỗi khi lưu kết quả xét nghiệm:", error);
  }
};


  const resetForm = () => {
    setFormData({
      doctorId: formData.doctorId,
      customerId: 0,
      customerEmail: "",
      customerName: "",
      date: "",
      typeOfTest: "",
      resultDescription: "",
    });
    setEditingId(null);
  };

  const handleEdit = (result: TestResult) => {
    setFormData(result);
    setEditingId(result.testResultId ?? null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Xác nhận xóa?")) {
      await ApiService.deleteTestResult(id);
      fetchTestResults();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý kết quả xét nghiệm</h1>

      {isDoctor && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="p-4 border rounded shadow-md mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Email bệnh nhân</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail || ""}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Tên bệnh nhân</label>
              <input
                type="text"
                value={formData.customerName || ""}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Ngày xét nghiệm</label>
              <input
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Loại xét nghiệm</label>
              <input
                type="text"
                name="typeOfTest"
                value={formData.typeOfTest || ""}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Kết quả mô tả</label>
              <textarea
                name="resultDescription"
                value={formData.resultDescription || ""}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-2 border rounded"
              ></textarea>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>           
            <th className="border px-2 py-1">Email bệnh nhân</th>
            <th className="border px-2 py-1">Tên bệnh nhân</th>
            <th className="border px-2 py-1">Bác sĩ</th>
            <th className="border px-2 py-1">Ngày</th>
            <th className="border px-2 py-1">Loại</th>
            <th className="border px-2 py-1">Kết quả</th>
            <th className="border px-2 py-1">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {testResults.map((item) => (
            <tr key={item.testResultId}>

              <td className="border px-2 py-1">{item.customerEmail}</td>
              <td className="border px-2 py-1">{item.customerName}</td>
              <td className="border px-2 py-1">{item.doctorId}</td>
              <td className="border px-2 py-1">
                {moment(item.date).format("DD/MM/YYYY")}
              </td>
              <td className="border px-2 py-1">{item.typeOfTest}</td>
              <td className="border px-2 py-1">{item.resultDescription}</td>
              <td className="border px-2 py-1">
                {isDoctor && (
                  <>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 mr-2 hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item.testResultId!)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {testResults.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-4 text-gray-500">
                Không có dữ liệu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
