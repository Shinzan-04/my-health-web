"use client";

import { useEffect, useState } from "react";

type Schedule = {
  scheduleId: number;
  date: string;
  startTime: string;
};

export default function DoctorSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const authData = localStorage.getItem("authData");
    if (!authData) return;

    try {
      const parsed = JSON.parse(authData);
      const id = parsed?.account?.doctor?.doctorId || parsed?.doctor?.doctorId;
      if (id) setDoctorId(id);
    } catch (e) {
      console.error("Lỗi khi phân tích authData:", e);
    }
  }, []);

  useEffect(() => {
    if (!doctorId) return;

    const token = JSON.parse(localStorage.getItem("authData") || "{}")?.token;

    fetch(`http://localhost:8080/api/schedules/doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi gọi API");
        return res.json();
      })
      .then(setSchedules)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [doctorId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Thời khóa biểu khám</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid grid-cols-7 gap-4 text-center">
          {["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map((day, idx) => (
            <div key={idx} className="font-semibold">{day}</div>
          ))}
          {Array.from({ length: 7 }).map((_, dayIdx) => {
            const daySchedules = schedules.filter((s) =>
              new Date(s.date).getDay() === dayIdx
            );
            return (
              <div key={dayIdx} className="border p-2 min-h-[80px] bg-white rounded-md shadow-sm">
                {daySchedules.length > 0 ? (
                  daySchedules.map((s) => (
                    <div key={s.scheduleId} className="text-sm text-gray-700">
                      {s.startTime}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Trống</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
