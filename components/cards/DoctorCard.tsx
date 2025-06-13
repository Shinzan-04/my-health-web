// components/cards/DoctorCardList.tsx
"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import ApiService from "@/app/service/ApiService";

interface Doctor {
  doctorId: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  description: string | null;
  workExperienceYears: number;
  avatarUrl?: string;
}

const DoctorCardList: FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await ApiService.getAllDoctorsWithAvatar();
        setDoctors(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      }
    };

    fetchDoctors();
  }, []);

  if (!doctors || doctors.length === 0) {
    return (
      <div className="bg-white border border-gray-300 p-6 rounded-lg shadow text-center text-gray-600">
        Không có bác sĩ nào
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {doctors.map((doctor) => (
        <div
          key={doctor.doctorId}
          className="bg-white border border-gray-300 p-6 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <img
            src={
              doctor.avatarUrl
                ? `http://localhost:8080${doctor.avatarUrl}`
                : "/images/doctor-placeholder.jpg"
            }
            alt={`Ảnh bác sĩ ${doctor.fullName}`}
            width={150}
            height={150}
            className="w-32 h-32 object-cover rounded-full mb-4"
          />

          <h3 className="text-xl font-semibold text-gray-900 text-center">{doctor.fullName}</h3>
          <p className="text-blue-700 font-medium">{doctor.specialization}</p>
          <p className="text-gray-700 text-sm">{doctor.email} - {doctor.phone}</p>
          <p className="text-gray-700 text-sm mt-1">
            {doctor.description || "Không có mô tả"}, {doctor.workExperienceYears} năm kinh nghiệm
          </p>
          <Link
            href={`/booking?doctorId=${doctor.doctorId}`}
            className="mt-4 text-blue-600 hover:underline"
          >
            Đặt lịch với bác sĩ
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DoctorCardList;
