"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import ApiService from "@/app/service/ApiService";
import "./fullcalendar-custom.css";

export default function DoctorSchedulePro() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
  const fetchSchedule = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const token = authData.token;
      const doctorId = authData.doctor?.doctorId;

      if (!token || !doctorId) {
        alert("Không tìm thấy thông tin đăng nhập.");
        return;
      }

      const res = await ApiService.getScheduleByDoctorId(doctorId);
      console.log("===> res từ API:", res); // <-- DÒNG QUAN TRỌNG

      if (!Array.isArray(res)) {
        throw new Error("Dữ liệu trả về không phải dạng mảng");
      }

      const transformed = res.map((s: any) => ({
        id: s.scheduleId,
        title: s.title,
        start: s.startTime,
        end: s.endTime,
      }));
      setEvents(transformed);
    } catch (error) {
      console.error("Lỗi khi tải lịch khám:", error);
    }
  };

  fetchSchedule();
}, []);


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 italic">
        <span className="font-bold not-italic"></span> SCHEDULE
      </h2>
      <div className="bg-white shadow rounded-lg p-4 border">
        <div className="mb-4 flex gap-6">
          <div>
            <label className="block text-sm text-gray-800 font-medium">Tên:</label>
            <input
              type="text"
              className="mt-1 block w-48 border border-gray-300 rounded-md text-gray-600 shadow-sm p-2"
              placeholder="Nhập tên"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-800 font-medium">Phòng khám:</label>
            <input
              type="text"
              className="mt-1 block w-48 border border-gray-300 rounded-md text-gray-600 shadow-sm p-2"
              placeholder="Nhập phòng khám"
            />
          </div>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          locale="vi"
          nowIndicator={true}
          slotMinTime="07:00:00"
          slotMaxTime="18:00:00"
          contentHeight="auto"
          dayHeaderClassNames={() => "bg-green-100 text-green-900 text-sm font-semibold"}
          slotLabelClassNames={() => "text-gray-700 text-xs"}
          eventClassNames={() =>
            "bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow"
          }
        />
      </div>
    </div>
  );
}
