"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

// Type
interface TestResult {
  testResultId?: number;
  doctorId?: number;
  doctorName?: string;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  date: string;
  typeOfTest: string;
  resultDescription: string;
}

export default function TestResultPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const doctorId = authData?.doctor?.doctorId;
      const currentRole = authData?.role;
      setRole(currentRole);

      let results: TestResult[] = [];
      if (currentRole === "DOCTOR") results = await ApiService.getTestResultsByDoctorId(doctorId);
      else if (currentRole === "USER") results = await ApiService.getMyTestResults();
      else results = await ApiService.getTestResults();

      setTestResults(results);
    };
    fetch();
  }, []);

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
    saveAs(file, `ket_qua_${tr.customerName?.replaceAll(" ", "_") || "xet_nghiem"}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 flex justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-6xl border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-800 tracking-wide">
          Kết quả xét nghiệm
        </h2>

        <div className="overflow-x-auto rounded-2xl shadow-xl border border-blue-100 mt-6">
          <table className="min-w-full text-base text-gray-700">
            <thead className="bg-blue-100 text-blue-900 uppercase tracking-wider text-sm">
              <tr>
                <th className="px-4 py-3 border border-blue-200">Ngày</th>
                <th className="px-4 py-3 border border-blue-200">Email bệnh nhân</th>
                <th className="px-4 py-3 border border-blue-200">Tên bệnh nhân</th>
                <th className="px-4 py-3 border border-blue-200">Tên bác sĩ</th>
                <th className="px-4 py-3 border border-blue-200">Loại xét nghiệm</th>
                <th className="px-4 py-3 border border-blue-200">Kết quả mô tả</th>
                {role !== "USER" && <th className="px-4 py-3 border border-blue-200">Xuất</th>}
              </tr>
            </thead>
            <tbody>
              {testResults.length === 0 ? (
                <tr>
                  <td colSpan={role !== "USER" ? 7 : 6} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center space-y-3">
                      <svg
                        className="w-12 h-12 text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        />
                      </svg>
                      <p className="font-semibold">Chưa có kết quả xét nghiệm</p>
                      <p className="text-sm text-gray-400">Hãy thực hiện xét nghiệm để có dữ liệu theo dõi sức khỏe.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                testResults.map((tr, index) => (
                  <tr
                    key={tr.testResultId || index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-3 border text-center">{format(new Date(tr.date), "dd/MM/yyyy")}</td>
                    <td className="px-4 py-3 border">{tr.customerEmail}</td>
                    <td className="px-4 py-3 border">{tr.customerName}</td>
                    <td className="px-4 py-3 border">{tr.doctorName}</td>
                    <td className="px-4 py-3 border">{tr.typeOfTest}</td>
                    <td className="px-4 py-3 border whitespace-pre-line break-words max-w-xs">{tr.resultDescription}</td>
                    {role !== "USER" && (
                      <td className="px-4 py-3 border text-center">
                        <button
                          onClick={() => exportSingleToExcel(tr)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Xuất
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
    </div>
  );
}
