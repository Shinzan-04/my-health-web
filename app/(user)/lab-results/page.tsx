"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

type TestResult = {
  testResultId?: number;
  date: string; // or visitDate depending on your DTO
  typeOfTest: string;
  resultDescription: string;
  doctorName?: string;
};

export default function TestResultsCustomerHistory() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTestResults() {
      try {
        const profile = await ApiService.getMyCustomerProfile(); // calls /api/customers/me with token internally

        const customerId = profile?.customerID || profile?.id;
        if (!customerId) throw new Error("Không tìm thấy thông tin khách hàng.");

        const results = await ApiService.getTestResultsByCustomerId(customerId);
        setResults(Array.isArray(results) ? results : results?.content || []);
      } catch (error: any) {
        setError(error.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }

    loadTestResults();
  }, []);

  if (loading) return <p>Đang tải kết quả xét nghiệm...</p>;
  if (error) return <p className="text-red-600 font-semibold">{error}</p>;

  return (
    <div className="min-h-0 bg-gray-100 flex items-start justify-center pt-10 px-2">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Kết quả xét nghiệm
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-base text-gray-700">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="py-3 px-6 border text-lg">Ngày xét nghiệm</th>
                <th className="py-3 px-6 border text-lg">Loại xét nghiệm</th>
                <th className="py-3 px-6 border text-lg">Mô tả kết quả</th>
                <th className="py-3 px-6 border text-lg">Bác sĩ</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-3 px-6 border text-center text-gray-500">
                    Không có kết quả xét nghiệm.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.testResultId} className="bg-white hover:bg-gray-50">
                    <td className="py-3 px-6 border whitespace-nowrap">{result.date}</td>
                    <td className="py-3 px-6 border">{result.typeOfTest}</td>
                    <td className="py-3 px-6 border">{result.resultDescription}</td>
                    <td className="py-3 px-6 border">{result.doctorName || "N/A"}</td>
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
