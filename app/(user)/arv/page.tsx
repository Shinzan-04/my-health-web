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
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Phác đồ ARV của bạn</h2>

<div className="overflow-x-auto rounded border border-gray-400 shadow-sm bg-white">
  <table className="min-w-full text-sm text-gray-900">
    <thead className="bg-gray-200 text-gray-700">
      <tr>
        <th className="border border-gray-400 px-4 py-2 text-left">Bệnh nhân</th>
        <th className="border border-gray-400 px-4 py-2 text-left">Bác sĩ</th>
        <th className="border border-gray-400 px-4 py-2 text-left">Bắt đầu</th>
        <th className="border border-gray-400 px-4 py-2 text-left">Kết thúc</th>
        <th className="border border-gray-400 px-4 py-2 text-left">Mã</th>
        <th className="border border-gray-400 px-4 py-2 text-left">Tên phác đồ</th>
        <th className="border border-gray-400 px-4 py-2 text-left">Lịch uống</th>
        <th className="border border-gray-400 px-4 py-2 text-left">Ghi chú</th>
      </tr>
    </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-400">
                    Đang tải...
                  </td>
                </tr>
              ) : arvRegimens.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-400">
                    Không có phác đồ ARV nào.
                  </td>
                </tr>
              ) : (
                arvRegimens.map((regimen) => (
                  <tr key={regimen.arvRegimenId} className="text-sm text-gray-800">
                    <td className="border px-3 py-2">{regimen.customerName}</td>
                    <td className="border px-3 py-2">{regimen.doctorName}</td>
                    <td className="border px-3 py-2">
                      {format(new Date(regimen.createDate), "dd/MM/yyyy")}
                    </td>
                    <td className="border px-3 py-2">
                      {format(new Date(regimen.endDate), "dd/MM/yyyy")}
                    </td>
                    <td className="border px-3 py-2">{regimen.regimenCode}</td>
                    <td className="border px-3 py-2">{regimen.regimenName}</td>
                    <td className="border px-3 py-2">{regimen.medicationSchedule || "-"}</td>
                    <td className="border px-3 py-2">{regimen.description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
