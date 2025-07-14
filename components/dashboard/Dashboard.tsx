"use client";
import DashboardHeader from "./DashboardHeader";
import KpiSection from "./KpiSection";
import RegistrationChart from "./RegistrationChart";
import RecentActivity from "./RecentActivity";
import TopDoctorsTable from "./TopDoctorsTable";
import StatusPieChart from "./StatusPieChart";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <DashboardHeader />
      <KpiSection />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RegistrationChart />
        <StatusPieChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentActivity />
        <TopDoctorsTable />
      </div>
    </div>
  );
}
