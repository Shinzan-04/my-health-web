"use client";
import { useState } from "react";

export default function MedicalHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const labTests = [
    {
      testType: "Huyết đồ",
      testDate: "2025-06-01",
      result: "Tiểu cầu: 90,000/mm³",
      referenceRange: "150,000 – 450,000/mm³",
      status: "abnormal",
      technician: "Nguyễn Văn X",
      notes: "Cần theo dõi tiểu cầu"
    },
    {
      testType: "Dengue NS1",
      testDate: "2025-06-01",
      result: "Dương tính",
      referenceRange: "Âm tính",
      status: "abnormal",
      technician: "Trần Thị Y",
      notes: "Khớp với triệu chứng lâm sàng"
    },
    {
      testType: "X-quang ngực",
      testDate: "2025-06-05",
      result: "Không thấy tổn thương phổi",
      referenceRange: "Bình thường",
      status: "normal",
      technician: "Lê Văn Z",
      notes: "Không viêm phổi"
    }
  ];

  return (
    <div className="min-h-0 bg-gray-100 flex items-start justify-center pt-10 px-2">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-5xl ">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Kết quả xét nghiệm
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-6 border text-lg">Loại xét nghiệm</th>
                <th className="py-3 px-6 border text-lg">Ngày xét nghiệm</th>
                <th className="py-3 px-6 border text-lg">Kết quả</th>
                <th className="py-3 px-6 border text-lg">Khoảng tham chiếu</th>
                <th className="py-3 px-6 border text-lg">Trạng thái</th>
                <th className="py-3 px-6 border text-lg">Bác sĩ</th>
                <th className="py-3 px-6 border text-lg">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {labTests.map((item, idx) => (
                <tr
                  key={idx}
                  className={item.status === "abnormal" ? "bg-red-50" : "bg-white"}
                >
                  <td className="py-3 px-6 border text-base">{item.testType}</td>
                  <td className="py-3 px-6 border text-base">{item.testDate}</td>
                  <td className="py-3 px-6 border text-base">{item.result}</td>
                  <td className="py-3 px-6 border text-base">{item.referenceRange}</td>
                  <td
                    className={`py-3 px-6 border text-base font-semibold ${
                      item.status === "abnormal" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item.status === "abnormal" ? "Bất thường" : "Bình thường"}
                  </td>
                  <td className="py-3 px-6 border text-base">{item.technician}</td>
                  <td className="py-3 px-6 border text-base">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
