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
  const [role, setRole] = useState("");
  const [doctorId, setDoctorId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    manualDoctorId: "",
  });

  const fetchSchedule = async (id: number) => {
    try {
      const res = await ApiService.getScheduleByDoctorId(id);
      if (!Array.isArray(res)) throw new Error("Dữ liệu trả về không hợp lệ");

      const transformed = res.map((s: any) => ({
        id: s.scheduleId,
        title: s.title,
        start: `${s.date}T${s.startTime}`,
        end: `${s.date}T${s.endTime}`,
      }));
      setEvents(transformed);
    } catch (error) {
      console.error("Lỗi khi tải lịch khám:", error);
    }
  };

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    const token = authData.token;
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

    if (payload) {
      setRole(payload.role);
      if (payload.role === "DOCTOR") {
        const id = authData.doctor?.doctorId;
        setDoctorId(id);
        if (id) fetchSchedule(id);
      }
    }
  }, []);

  useEffect(() => {
    if (role === "ADMIN" && form.manualDoctorId) {
      const id = Number(form.manualDoctorId);
      if (!isNaN(id)) fetchSchedule(id);
    }
  }, [form.manualDoctorId]);

  const handleCreateSchedule = async () => {
    const id = role === "DOCTOR" ? doctorId : Number(form.manualDoctorId);
    if (!id || !form.date || !form.startTime || !form.endTime || !form.title) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      await ApiService.createSchedule({
        title: form.title,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        room: form.room,
        doctorId: id,
      });
      alert("Tạo lịch thành công!");
      setForm({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        room: "",
        manualDoctorId: "",
      });
      fetchSchedule(id);
    } catch (err) {
      console.error(err);
      alert("Tạo lịch thất bại.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 italic">SCHEDULE</h2>

      <div className="bg-white shadow rounded-lg p-4 border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {role === "ADMIN" && (
            <div>
              <label className="block text-sm font-medium text-gray-800">ID Bác sĩ</label>
              <input
                type="number"
                value={form.manualDoctorId}
                onChange={(e) => setForm({ ...form, manualDoctorId: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Nhập ID bác sĩ"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-800">Tiêu đề</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Tiêu đề lịch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Ngày</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Bắt đầu</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Kết thúc</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Phòng khám</label>
            <input
              type="text"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Phòng khám"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreateSchedule}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tạo lịch
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 border">
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
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // dùng giờ 24h
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // dùng giờ 24h
          }}
          dayHeaderClassNames={() =>
            "bg-green-100 text-green-900 text-sm font-semibold"
          }
          slotLabelClassNames={() => "text-gray-700 text-xs"}
          eventClassNames={() =>
            "bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow"
          }
        />
      </div>
    </div>
  );
}
