// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import Link from "next/link";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    doctors: 0,
    customers: 0,
    arv: 0,
    blogs: 0,
    registrations: 0,
    testResults: 0,
  });

  const [registrationStats, setRegistrationStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchCounts = async () => {
      const [doctors, customers, arvs, blogs, regs, tests] = await Promise.all([
        ApiService.getAllDoctors(),
        ApiService.getAllCustomers(),
        ApiService.getARVRegimens(),
        ApiService.getAllBlogs(),
        ApiService.getAllRegistrations(),
        ApiService.getTestResults(),
      ]);

      setCounts({
        doctors: doctors.length,
        customers: customers.length,
        arv: arvs.length,
        blogs: blogs.length,
        registrations: regs.length,
        testResults: tests.length,
      });

      const groupedByMonth = regs.reduce((acc: any, r: any) => {
        const month = moment(r.appointmentDate).format("YYYY-MM");
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const stats = Object.entries(groupedByMonth).map(([month, count]) => ({
        month,
        count,
      }));

      setRegistrationStats(stats);
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700">Bảng điều khiển</h1>

      {/* Tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: "Bác sĩ", value: counts.doctors, href: "/admin/doctors" },
          { title: "Bệnh nhân", value: counts.customers, href: "/admin/users" },
          { title: "ARV", value: counts.arv, href: "/admin/arv" },
          { title: "Bài viết", value: counts.blogs, href: "/blog" },
          { title: "Lịch khám", value: counts.registrations, href: "/admin/list-registration" },
          { title: "Xét nghiệm", value: counts.testResults, href: "/admin/testresults" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm block cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="p-4 text-center">
              <div className="text-lg font-semibold text-blue-900">{item.title}</div>
              <div className="text-3xl font-bold text-blue-600">{item.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Biểu đồ lượt đăng ký */}
      <div>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Lượt đăng ký theo tháng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={registrationStats}>
            <XAxis dataKey="month" stroke="#1D4ED8" />
            <YAxis stroke="#1D4ED8" />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
