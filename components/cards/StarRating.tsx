// components/StarRating.tsx
import { FC, useState } from "react";
import RatingPopup from "./RatingPopup";
import ApiService from "@/app/service/ApiService";

interface StarRatingProps {
  rating: number; // Giá trị trung bình
  doctorId: number;
  ratingCount: number;
}

const StarRating: FC<StarRatingProps> = ({ rating, doctorId, ratingCount }) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleStarClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hiển thị sao trung bình (có thể lẻ như 2.5) */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleStarClick}>
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
      <span className="text-sm text-gray-600 mt-1">{rating.toFixed(1)} / 5</span>

      {/* Popup đánh giá */}
      {isPopupOpen && (
        <RatingPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
onSubmit={(star, comment) => {
  ApiService.submitRating(star, doctorId, comment)
    .then(() => console.log("Gửi đánh giá thành công"))
    .catch((err) => console.error("Lỗi gửi đánh giá:", err));
  handleClosePopup();
}}

        />
      )}
    </div>
  );
};

export default StarRating;
