// components/StarRating.tsx
import { FC, useState } from "react";
import RatingPopup from "./RatingPopup";

interface StarRatingProps {
  rating: number; // Rating value between 0 and 5
  onRate: (rating: number, comment: string) => void; // Callback for rating submission
}

const StarRating: FC<StarRatingProps> = ({ rating, onRate }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleStarClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <div className="flex cursor-pointer" onClick={handleStarClick}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
      <RatingPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={(rating, comment) => {
          onRate(rating, comment);
          handleClosePopup(); // Close the popup after submission
        }}
      />
    </div>
  );
};

export default StarRating;
