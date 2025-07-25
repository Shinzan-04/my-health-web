"use client";
import { FC, useState } from "react";
import toast from "react-hot-toast";

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
    if (!rating || !comment.trim()) {
      toast.error("Vui lòng chọn sao và nhập bình luận!", {
        style: { background: "#fff1f2", color: "#dc2626" },
      });
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Đánh giá bác sĩ</h2>

        {/* Chọn sao */}
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Bình luận */}
        <textarea
          className="w-full border border-gray-300 p-2 rounded mb-4 resize-none text-gray-700 placeholder-gray-400"
          rows={4}
          placeholder="Nhập bình luận của bạn"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Nút hành động */}
        <div className="flex justify-end">
          <button
            className="mr-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;
