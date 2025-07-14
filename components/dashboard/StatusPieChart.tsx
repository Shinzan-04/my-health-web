"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#28da9eff", "#ff6767ff"]; // xanh lá - đã khám, đỏ - chưa khám

export default function StatusPieChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const regs = await ApiService.getAllRegistrations();
      const completed = regs.filter((r: any) => r.status === true).length;
      const pending = regs.length - completed;

      setData([
        { name: "ĐÃ KHÁM", value: completed },
        { name: "CHƯA KHÁM", value: pending },
      ]);
      setTotal(regs.length);
    })();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow h-[400px] relative">
      <h3 className="text-lg font-semibold text-gray-700">Tình trạng khám</h3>
      <ResponsiveContainer width="100%" height="80%" >
        <PieChart >
          <Pie 
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any) => [`${value} lượt`, name]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              color: "#1f2937",
              fontSize: 14,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Hiển thị tổng số ở giữa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-gray-700 text-sm">Tổng lượt</div>
        <div className="text-2xl font-bold text-gray-700">{total}</div>
      </div>

      {/* Chú thích */}
      <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full " style={{ backgroundColor: COLORS[0] }}></span>
          <span>ĐÃ KHÁM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></span>
          <span>CHƯA KHÁM</span>
        </div>
      </div>
    </div>
  );
}
