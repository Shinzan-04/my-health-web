"use client";

import Link from "next/link";
import StarRating from "./StarRating";

interface Rating {
  ratingId: number;
  rating: number;
  comment: string;
  createAt: string;
}

interface Doctor {
  doctorId: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  description: string | null;
  workExperienceYears: number;
  avatarUrl?: string;
  averageRating: number;
  ratings: Rating[]; // Thêm dòng này
}

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
const avatarSrc = doctor.avatarUrl && doctor.avatarUrl !== "null"
  ? `http://localhost:8080${doctor.avatarUrl}`
  : "/images/doctor-placeholder.jpg";


  return (
<div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col min-h-[520px]">
  <img
    src={avatarSrc}
    alt={`Ảnh bác sĩ ${doctor.fullName}`}
    className="w-full h-95 object-cover rounded-t-lg"
  />
  <div className="p-4 flex flex-col justify-between flex-grow text-center">
    <h3 className="text-lg font-semibold text-gray-800">Dr. {doctor.fullName}</h3>
    <p className="text-blue-600 text-sm">{doctor.specialization || "Chưa rõ chuyên môn"}</p>
    <p className="text-gray-600 text-sm">{doctor.email} - {doctor.phone}</p>
    <p className="text-gray-600 text-sm mt-1">
      {doctor.description || "Không có mô tả"}</p>
      <p className="text-gray-600 text-sm mt-1">
      {doctor.workExperienceYears} năm kinh nghiệm
    </p>
<StarRating
  rating={doctor.averageRating}
  doctorId={doctor.doctorId}
  ratingCount={doctor.ratings.length}
/>



    <Link
      href={`/registrations?doctorId=${doctor.doctorId}`}
      className="mt-3 inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full"
    >
      Đặt lịch với bác sĩ
    </Link>
  </div>
</div>

  );
};

export default DoctorCard;
