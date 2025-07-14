"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import ApiService from "@/app/service/ApiService";
import TestResultPreviewCard from "./TestResultPreviewCard";

interface TestResult {
  testResultId: number;
  doctorName?: string;
  customerName?: string;
  customerEmail?: string;
  date: string;
  typeOfTest: string;
  resultDescription: string;
}

export default function TestResultUserView() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  useEffect(() => {
    (async () => {
      try {
        const data = await ApiService.getMyTestResults();
        setResults(data);
      } catch (err) {
        console.error("Lỗi tải kết quả:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedResult(null);
    }
  };

  const filteredResults = results.filter((r) =>
    r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.typeOfTest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="p-4 space-y-6 bg-white min-h-screen max-w-[1400px] mx-auto">
      {/* Tiêu đề + Tìm kiếm */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-blue-800">Kết quả xét nghiệm của bạn</h2>
        <input
          type="text"
          placeholder="🔍 Tìm theo tên, loại xét nghiệm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-96"
        />
      </div>

      {/* Danh sách kết quả */}
      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : paginatedResults.length === 0 ? (
          <div className="text-center text-gray-500">Không có kết quả xét nghiệm.</div>
        ) : (
          paginatedResults.map((tr, idx) => (
            <div
              key={tr.testResultId}
              className={`p-4 border rounded shadow-sm transition hover:shadow-md ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{tr.typeOfTest}</h3>
                  <p className="text-sm text-gray-500">
                    Ngày xét nghiệm: {format(new Date(tr.date), "dd/MM/yyyy")}
                  </p>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  onClick={() => setSelectedResult(tr)}
                >
                  Xem chi tiết →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang giống ARVPage */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>
            Trang {currentPage} / {totalPages} ({filteredResults.length} kết quả)
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              ← Trước
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              Sau →
            </button>
          </div>
        </div>
      )}

      {/* Modal chi tiết kết quả */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
  className="fixed inset-0 z-50 flex items-center justify-center px-4"

            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-h-[95vh] overflow-y-auto rounded-lg shadow-lg p-6 w-full max-w-[1000px] relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setSelectedResult(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
              >
                ×
              </button>

              <TestResultPreviewCard
                {...selectedResult}
                testResultId={selectedResult.testResultId}
                customerName={selectedResult.customerName || ""}
                customerEmail={selectedResult.customerEmail}
                doctorName={selectedResult.doctorName || ""}
                date={format(new Date(selectedResult.date), "dd/MM/yyyy")}
                typeOfTest={selectedResult.typeOfTest}
                resultDescription={selectedResult.resultDescription}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
