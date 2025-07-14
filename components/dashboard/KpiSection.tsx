"use client";
import { useEffect, useState } from "react";
import KpiCard from "./KpiCard";
import ApiService from "@/app/service/ApiService";

export default function KpiSection() {
  const [data, setData] = useState({
    doctors: 0,
    customers: 0,
    arv: 0,
    blogs: 0,
    registrations: 0,
    testResults: 0,
  });

  useEffect(() => {
    (async () => {
      const [doctors, customers, arvs, blogs, regs, tests] = await Promise.all([
        ApiService.getAllDoctors(),
        ApiService.getAllCustomers(),
        ApiService.getARVRegimens(),
        ApiService.getAllBlogs(),
        ApiService.getAllRegistrations(),
        ApiService.getTestResults(),
      ]);
      setData({
        doctors: doctors.length,
        customers: customers.length,
        arv: arvs.length,
        blogs: blogs.length,
        registrations: regs.length,
        testResults: tests.length,
      });
    })();
  }, []);

  const kpis = [
    { label: "Bác sĩ", value: data.doctors, href: "/admin/doctors" },
    { label: "Bệnh nhân", value: data.customers, href: "/admin/users" },
    { label: "ARV", value: data.arv, href: "/admin/arv" },
    { label: "Bài viết", value: data.blogs, href: "/blogs" },
    { label: "Lịch khám", value: data.registrations, href: "/admin/list-registration" },
    { label: "Xét nghiệm", value: data.testResults, href: "/admin/testresults" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} href={kpi.href} />
      ))}
    </div>
  );
}
