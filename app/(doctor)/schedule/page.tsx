"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect, useRef } from "react";
import ApiService from "@/app/service/ApiService";
import toast from "react-hot-toast";
import "./fullcalendar-custom.css";

export default function DoctorSchedulePro() {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    manualDoctorId: "",
  });

  const eventToastRef = useRef<string | null>(null);

  const fetchSchedule = async (id: number) => {
    try {
      const res = await ApiService.getScheduleByDoctorId(id);
      if (!Array.isArray(res)) throw new Error("Dữ liệu trả về không hợp lệ");

      const transformed = res.map((s: any) => ({
        id: s.scheduleId,
        title: s.title,
        start: `${s.date}T${s.startTime}`,
        end: `${s.date}T${s.endTime}`,
        extendedProps: {
          room: s.room,
          patientName: s.patientName,
          doctorId: s.doctorId,
        },
      }));
      setEvents(transformed);
    } catch (error) {
      toast.error("Lỗi khi tải lịch.", {
        style: { background: "#fff1f2", color: "#dc2626" },
      });
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

  const handleCreateOrUpdate = async () => {
    const id = role === "DOCTOR" ? doctorId : Number(form.manualDoctorId);
    if (!id || !form.date || !form.startTime || !form.endTime || !form.title) {
      toast.error("Vui lòng điền đầy đủ thông tin.", {
        style: { background: "#fff1f2", color: "#dc2626" },
      });
      return;
    }

    const scheduleData = {
      title: form.title,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      room: form.room,
      doctorId: id,
    };

    const toastId = toast.loading("Đang xử lý...");

    try {
      if (editingId) {
        await ApiService.updateSchedule(editingId, scheduleData);
        toast.success("🎉 Cập nhật lịch thành công!", {
          id: toastId,
          style: { background: "#f0fdf4", color: "#16a34a" },
        });
        setEditingId(null);
      } else {
        await ApiService.createSchedule(scheduleData);
        toast.success("🎉 Tạo lịch thành công!", {
          id: toastId,
          style: { background: "#f0fdf4", color: "#16a34a" },
        });
      }

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
      toast.error("Thao tác thất bại.", {
        id: toastId,
        style: { background: "#fff1f2", color: "#dc2626" },
      });
    }
  };

const handleDeleteEvent = (event: any) => {
  if (eventToastRef.current) {
    toast.dismiss(eventToastRef.current);
  }

  const toastId = toast.custom(
    (t) => (
      <div className="bg-white border shadow-lg rounded p-4 w-72">
        <p className="text-gray-800 font-semibold mb-2">Bạn có chắc muốn xóa lịch này không?</p>
        <div className="flex justify-between">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              eventToastRef.current = null;

              try {
                await ApiService.deleteSchedule(event.id);
                toast.success("✅ Xóa thành công!", {
                  style: { background: "#f0fdf4", color: "#16a34a" },
                });
                const id = role === "DOCTOR" ? doctorId : Number(form.manualDoctorId);
                fetchSchedule(id!);
              } catch (err: any) {
                if (err.response?.status === 409) {
                  toast.error("❌ Không thể xóa vì đã có bệnh nhân đăng ký.", {
                    style: { background: "#fff1f2", color: "#dc2626" },
                  });
                } else {
                  toast.error("❌ Xóa thất bại. Vui lòng thử lại.", {
                    style: { background: "#fff1f2", color: "#dc2626" },
                  });
                }
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Xác nhận
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              eventToastRef.current = null;
            }}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Hủy
          </button>
        </div>
      </div>
    ),
    { duration: Infinity }
  );

  eventToastRef.current = toastId;
};

  const handleEditEvent = (event: any) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    setForm({
      title: event.title,
      date: start.toISOString().split("T")[0],
      startTime: start.toTimeString().slice(0, 5),
      endTime: end.toTimeString().slice(0, 5),
      room: event.extendedProps.room || "",
      manualDoctorId: event.extendedProps.doctorId?.toString() || "",
    });
    setEditingId(event.id);
  };

  const hourOptions = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 7; // Bắt đầu từ 7h
    return `${hour.toString().padStart(2, "0")}:00`;
  });

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
                className="mt-1 p-2 w-full border rounded-md text-gray-800"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-800">Tiêu đề</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Ngày</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Bắt đầu</label>
            <select
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
            >
              <option value="">-- Giờ bắt đầu --</option>
              {hourOptions.map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Kết thúc</label>
            <select
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
            >
              <option value="">-- Giờ kết thúc --</option>
              {hourOptions.map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Phòng khám</label>
            <input
              type="text"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreateOrUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Cập nhật lịch" : "Tạo lịch"}
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
            hour12: false,
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventContent={({ event }) => (
            <div>
              <div className="">{event.title}</div>
              <div className="text-xs">
                Phòng: {event.extendedProps.room || "Không rõ"}
              </div>
            </div>
          )}
          eventClick={({ event }) => {
            if (eventToastRef.current) {
              toast.dismiss(eventToastRef.current);
            }

            const id = toast.custom((t) => (
              <div className="bg-white border shadow-lg rounded p-4 w-72">
                <p className="text-gray-800 font-semibold mb-2">Chọn hành động</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      handleEditEvent(event);
                      toast.dismiss(t.id);
                      eventToastRef.current = null;
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteEvent(event);
                      toast.dismiss(t.id);
                      eventToastRef.current = null;
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ));

            eventToastRef.current = id;
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
