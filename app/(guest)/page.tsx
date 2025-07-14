// app/page.tsx
import type { Metadata } from "next";
import DoctorCardList from "@/components/cards/DoctorCardList";

export const metadata: Metadata = {
  title: "Trang Chủ - Y Tế Thông Minh",
  description: "Chọn bác sĩ phù hợp và đặt lịch ngay.",
};

export default function HomePage() {
  return (
    <div className="py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center tracking-tight drop-shadow">
        Danh sách bác sĩ
      </h1>
      <DoctorCardList />
    </div>
  );
}
