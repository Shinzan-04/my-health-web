"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

type RatingItem = { doctorName: string; star: number; comment: string };

export default function DoctorRatingChart() {
  const [data, setData] = useState<
    { doctorName: string; avgRating: number; comments: string[] }[]
  >([]);

  useEffect(() => {
    (async () => {
      const ratings: RatingItem[] = await ApiService.getAllRating();
      const map: Record<string, { total: number; cnt: number; comments: string[] }> = {};

      ratings.forEach(({ doctorName = "Không rõ", star = 0, comment = "" }) => {
        if (!map[doctorName]) map[doctorName] = { total: 0, cnt: 0, comments: [] };
        map[doctorName].total += star;
        map[doctorName].cnt += 1;
        if (comment.trim()) map[doctorName].comments.push(comment);
      });

      const arr = Object.entries(map).map(([doctorName, v]) => ({
        doctorName,
        avgRating: +(v.total / v.cnt).toFixed(1),
        comments: v.comments.slice(-3),
      }));
      setData(arr);
    })();
  }, []);

  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;
    const { doctorName, comments } = payload[0].payload as any;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow">
        <div className="font-semibold mb-1">{doctorName}</div>
        <div className="mb-2">⭐ Trung bình: {payload[0].value}</div>
        {comments.length ? (
          <>
            <div className="font-medium">Bình luận mới:</div>
            {comments.map((c: string, i: number) => (
              <div key={i} className="italic text-gray-500">• {c}</div>
            ))}
          </>
        ) : (
          <div className="italic text-gray-400">Chưa có bình luận</div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">⭐ Đánh giá bác sĩ</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="doctorName" />
          <YAxis domain={[0, 5]} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avgRating" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
