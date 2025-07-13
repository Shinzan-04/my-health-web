// app/page.tsx
import type { Metadata } from "next";
import DoctorCardList from "@/components/cards/DoctorCardList";

export const metadata: Metadata = {
  title: "Trang Chủ - Y Tế Thông Minh",
  description: "Chọn bác sĩ phù hợp và đặt lịch ngay.",
};

export default function HomePage() {
  return (
    <div>
      <h1>
        Danh sách bác sĩ
      </h1>
      <DoctorCardList />
    </div>
  );
}
