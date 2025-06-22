"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { format } from "date-fns";

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
      } finally {
        setLoading(false);
      }
    };

    fetchMyARV();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Phác đồ ARV của bạn</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead className="bg-blue-100 text-sm text-blue-900">
            <tr>
              <th className="px-3 py-2 border">Bệnh nhân</th>
              <th className="px-3 py-2 border">Bác sĩ</th>
              <th className="px-3 py-2 border">Bắt đầu</th>
              <th className="px-3 py-2 border">Kết thúc</th>
              <th className="px-3 py-2 border">Mã</th>
              <th className="px-3 py-2 border">Tên phác đồ</th>
              <th className="px-3 py-2 border">Lịch uống</th>
              <th className="px-3 py-2 border">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-4">Đang tải...</td>
              </tr>
            ) : arvRegimens.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4">Không có phác đồ ARV nào.</td>
              </tr>
            ) : (
              arvRegimens.map((regimen) => (
                <tr key={regimen.arvRegimenId} className="text-sm text-gray-700">
                  <td className="border px-3 py-2">{regimen.customerName}</td>
                  <td className="border px-3 py-2">{regimen.doctorName}</td>
                  <td className="border px-3 py-2">{format(new Date(regimen.createDate), "dd/MM/yyyy")}</td>
                  <td className="border px-3 py-2">{format(new Date(regimen.endDate), "dd/MM/yyyy")}</td>
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
  );
}
