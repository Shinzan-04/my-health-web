"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

type ARVRegimen = {
  arvRegimenId: number;
  doctorName: string;
  customerName: string;
  createDate: string;
  endDate: string;
  regimenCode: string;
  regimenName: string;
  medicationSchedule: string;
  description: string;
};

export default function ARVPage() {
  const [arvRegimens, setArvRegimens] = useState<ARVRegimen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyARV = async () => {
      try {
        const data = await ApiService.getMyARVRegimens();
        setArvRegimens(data);
      } catch (err) {
        console.error("Lỗi khi lấy ARV:", err);
        toast.error("Lỗi khi tải phác đồ ARV.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyARV();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 flex justify-center">
        <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-6xl border border-blue-100">
          <h2 className="text-3xl font-bold text-blue-800 tracking-wide">
            Phác đồ điều trị ARV
          </h2>

          <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 mt-6">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-blue-100 text-gray-900 text-md uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border">Bắt đầu</th>
                  <th className="px-4 py-3 border">Kết thúc</th>
                  <th className="px-4 py-3 border">Tên phác đồ</th>
                  <th className="px-4 py-3 border">Mã</th>
                  <th className="px-4 py-3 border">Bác sĩ</th>
                  <th className="px-4 py-3 border">Lịch uống</th>
                  <th className="px-4 py-3 border">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : arvRegimens.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <svg
                          className="w-10 h-10 text-blue-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          />
                        </svg>
                        <span>Không có dữ liệu phác đồ ARV.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  arvRegimens.map((arv, index) => (
                    <tr
                      key={arv.arvRegimenId || index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 border whitespace-nowrap">
                        {arv.createDate
                          ? format(new Date(arv.createDate), "dd/MM/yyyy")
                          : ""}
                      </td>
                      <td className="px-4 py-3 border whitespace-nowrap">
                        {arv.endDate
                          ? format(new Date(arv.endDate), "dd/MM/yyyy")
                          : ""}
                      </td>
                      <td className="px-4 py-3 border">{arv.regimenName}</td>
                      <td className="px-4 py-3 border">{arv.regimenCode}</td>
                      <td className="px-4 py-3 border">
                        {arv.doctorName || "N/A"}
                      </td>
                      <td className="px-4 py-3 border">
                        {arv.medicationSchedule || "-"}
                      </td>
                      <td className="px-4 py-3 border">
                        {arv.description || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
