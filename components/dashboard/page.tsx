
"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiSection from "@/components/dashboard/KpiSection";
import RegistrationChart from "@/components/dashboard/RegistrationChart";
import TopDoctorsTable from "@/components/dashboard/TopDoctorsTable";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatusPieChart from "@/components/dashboard/StatusPieChart";
import DoctorRatingChart from "@/components/dashboard/DoctorRatingChart";


export default function DashboardPage() {
  const [counts, setCounts] = useState({ doctors: 0, customers: 0, arv: 0, blogs: 0, registrations: 0, testResults: 0 });

  useEffect(() => {
    (async () => {
      try {
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
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu tổng quan:", err);
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />
      <KpiSection counts={counts} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><RegistrationChart /></div>
        <div><StatusPieChart /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopDoctorsTable />
        <RecentActivity />
        
      </div>
    </div>
  );
}
