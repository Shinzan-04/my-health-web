// components/StarRating.tsx
"use client";

import { FC, useState } from "react";
import RatingPopup from "./RatingPopup";
import ApiService from "@/app/service/ApiService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface StarRatingProps {
  rating: number;
  doctorId: number;
  ratingCount: number;
}

const StarRating: FC<StarRatingProps> = ({ rating, doctorId, ratingCount }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  /** Mở popup nếu đã login, ngược lại hiện toast + điều hướng login */
  const handleStarClick = () => {
    const authData = localStorage.getItem("authData");
    const token = authData ? JSON.parse(authData).token : null;

    if (!token) {
      toast.error("Vui lòng đăng nhập để đánh giá!");
      return;
    }
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <div className="flex flex-col items-center">
      {/* Hiển thị sao trung bình (có thể lẻ) */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleStarClick}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isHalf = rating >= star - 0.5 && rating < star;
          return (
            <span key={star} className="text-2xl">
              {rating >= star ? (
                <span className="text-yellow-500">★</span>
              ) : isHalf ? (
                <span className="text-yellow-500">☆</span>
              ) : (
                <span className="text-gray-300">★</span>
              )}
            </span>
          );
        })}
        <span className="text-sm text-gray-600">({ratingCount})</span>
      </div>
      <span className="text-sm text-gray-600 mt-1">
        {rating.toFixed(1)} / 5
      </span>

      {/* Popup đánh giá */}
{isPopupOpen && (
  <RatingPopup
    isOpen={isPopupOpen}
    onClose={handleClosePopup}
    onSubmit={async (star, comment) => {
  try {
    await ApiService.submitRating(star, doctorId, comment);
    toast.success("🎉 Gửi đánh giá thành công!");
  } catch (err: any) {
    //console.error(err);

    // Kiểm tra cả trường hợp backend trả string hoặc object message
    const errorMessage = err.response?.data?.message || err.response?.data || "";

    if (errorMessage === "Rating already exists") {
      toast.error("Bạn đã đánh giá bác sĩ này rồi.");
    } else {
      toast.error("Không gửi được đánh giá!");
    }
  }
  handleClosePopup();
}}
  />
)}

    </div>
  );
};

export default StarRating;
