"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ApiService from "@/service/ApiService";
import { User, Stethoscope, CalendarCheck } from "lucide-react";

export default function AdminDashboard() {
  const [doctorCount, setDoctorCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [doctors, customers, appointments] = await Promise.all([
        ApiService.getAllDoctors(),
        ApiService.getAllCustomers(),
        ApiService.getAllAppointments(),
      ]);

      setDoctorCount(doctors.length);
      setCustomerCount(customers.length);
      setAppointmentCount(appointments.length);
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
    }
  };

  const StatCard = ({ icon, label, value }: { icon: JSX.Element; label: string; value: number }) => (
    <Card className="w-full sm:w-[250px] shadow-md border border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-6">
        <div className="text-primary mb-2">{icon}</div>
        <div className="text-2xl font-semibold text-gray-700">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan quản trị</h1>
      <div className="flex flex-wrap gap-4">
        <StatCard icon={<Stethoscope size={32} />} label="Bác sĩ" value={doctorCount} />
        <StatCard icon={<User size={32} />} label="Bệnh nhân" value={customerCount} />
        <StatCard icon={<CalendarCheck size={32} />} label="Lịch hẹn" value={appointmentCount} />
      </div>
    </div>
  );
}
