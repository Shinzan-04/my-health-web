"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

export default function TopDoctorsTable() {
  const [list, setList] = useState<{ doctorName: string; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      const regs = await ApiService.getAllRegistrations();
      const countMap: Record<string, number> = {};

      regs.forEach((r: any) => {
        const name = r.doctorName || "Không rõ";
        countMap[name] = (countMap[name] || 0) + 1;
      });

      const sorted = Object.entries(countMap)
        .map(([doctorName, count]) => ({ doctorName, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setList(sorted);
    })();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow h-full">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Top bác sĩ có nhiều lượt khám</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Tên bác sĩ</th>
            <th>Lượt khám</th>
          </tr>
        </thead>
        <tbody>
          {list.map((doc) => (
            <tr key={doc.doctorName} className="border-t text-gray-800">
              <td>{doc.doctorName}</td>
              <td>{doc.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
