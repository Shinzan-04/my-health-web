"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";
import DoctorCard from "./DoctorCard";

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

const DoctorCardList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

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

  const next = () => {
    if (startIndex + visibleCount < doctors.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const currentDoctors = doctors.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {currentDoctors.map((doctor) => (
          <DoctorCard key={doctor.doctorId} doctor={doctor} />
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={prev}
          disabled={startIndex === 0}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <button
          onClick={next}
          disabled={startIndex + visibleCount >= doctors.length}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};


export default DoctorCardList;
