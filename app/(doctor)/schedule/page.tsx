"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import './fullcalendar-custom.css';

const scheduleEvents = [
  {
    id: "1",
    title: "Khám bệnh (Sáng)",
    start: "2025-06-10T08:00:00",
    end: "2025-06-10T10:00:00",
  },
  {
    id: "2",
    title: "Khám bệnh (Chiều)",
    start: "2025-06-10T14:00:00",
    end: "2025-06-10T16:00:00",
  },
  {
    id: "3",
    title: "Khám tổng quát",
    start: "2025-06-11T09:00:00",
    end: "2025-06-11T11:00:00",
  },
  {
    id: "4",
    title: "Tái khám",
    start: "2025-06-12T13:00:00",
    end: "2025-06-12T14:30:00",
  },
];

export default function DoctorSchedulePro() {
  const [events, setEvents] = useState(scheduleEvents);

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
