"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import moment from "moment";

export default function RecentActivity() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const regs = await ApiService.getAllRegistrations();
      const recent = regs
        .sort((a: any, b: any) => moment(b.appointmentDate).valueOf() - moment(a.appointmentDate).valueOf())
        .slice(0, 5)
        .map((r: any) => ({
          id: r.registrationId,
          desc: `${r.fullName} đặt lịch với BS. ${r.doctorName}`,
          time: moment(r.appointmentDate).fromNow(),
        }));
      setList(recent);
    })();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow h-full text-gray-800">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">Hoạt động gần đây</h3>
      <ul className="text-sm space-y-2">
        {list.map((r) => (
          <li key={r.id} className="flex justify-between pb-1">
            <span>{r.desc}</span>
            <span className="text-gray-500">{r.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
