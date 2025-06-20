// components/RatingPopup.tsx
import { FC, useState } from "react";

interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const RatingPopup: FC<RatingPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(rating, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Đánh giá bác sĩ</h2>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Nhập bình luận của bạn"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end">
          <button className="mr-2 text-gray-500" onClick={onClose}>Hủy</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Gửi</button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;
