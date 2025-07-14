"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import moment from "moment";
import "moment/locale/vi";

type Mode = "day" | "month" | "year";

export default function RegistrationChart() {
  const [data, setData] = useState<{ label: string; count: number }[]>([]);
  const [mode, setMode] = useState<Mode>("month");

  useEffect(() => {
    moment.locale("vi");

    (async () => {
      try {
        const regs = await ApiService.getAllRegistrations();
        const grouped: Record<string, number> = {};

        regs.forEach((r: any) => {
          const date = moment(r.appointmentDate);
          if (!date.isValid()) return;

          let key = "";
          if (mode === "day") key = date.format("DD/MM/YYYY");
          else if (mode === "month") key = date.format("MM/YYYY");
          else key = date.format("YYYY");

          grouped[key] = (grouped[key] || 0) + 1;
        });

        const sorted = Object.entries(grouped)
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) =>
            moment(a.label, mode === "day" ? "DD/MM/YYYY" : mode === "month" ? "MM/YYYY" : "YYYY").isAfter(
              moment(b.label, mode === "day" ? "DD/MM/YYYY" : mode === "month" ? "MM/YYYY" : "YYYY")
            )
              ? 1
              : -1
          );

        setData(sorted);
      } catch (err) {
        console.error("Lỗi khi load biểu đồ:", err);
      }
    })();
  }, [mode]);

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">📈 Biểu đồ lượt đăng ký</h3>
        <div className="flex space-x-2">
          {["day", "month", "year"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as Mode)}
              className={`px-3 py-1 rounded-full border text-sm ${
                mode === m ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"
              } hover:bg-blue-100 transition`}
            >
              {m === "day" ? "Ngày" : m === "month" ? "Tháng" : "Năm"}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          {/* Không vẽ lưới */}
          <XAxis
            dataKey="label"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              color: "#1f2937",
              fontSize: "14px",
            }}
            itemStyle={{ color: "#1d4ed8", fontWeight: "500" }}
            labelFormatter={(label) => `📅 ${label}`}
            formatter={(value) => [`${value} lượt đăng ký`, "👤"]}
          />
          {/* Đổ bóng giống ảnh */}
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#colorBlue)"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
