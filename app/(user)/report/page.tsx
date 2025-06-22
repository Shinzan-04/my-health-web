"use client";

import { useState } from "react";

export default function ReportPage() {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Nếu bạn có danh sách lịch hẹn (appointment) và tài khoản (account), hãy lấy từ API và cho chọn ở đây
  // Ví dụ: const [appointmentId, setAppointmentId] = useState("");
  // const [accountId, setAccountId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Gửi dữ liệu về server tại đây, ví dụ:
    // await ApiService.createReport({ reason, description, accountId, appointmentId });
    alert("Đã gửi báo cáo!");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
        Gửi Báo Cáo
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1" htmlFor="reason">
            Lý do báo cáo:
          </label>
          <input
            id="reason"
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Nhập lý do báo cáo"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="description">
            Mô tả chi tiết:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Nhập mô tả chi tiết"
          />
        </div>
        {/* Nếu có chọn lịch hẹn hoặc tài khoản, thêm select ở đây */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Gửi Báo Cáo
        </button>
        {submitted && (
          <div className="text-green-600 text-center mt-2">
            Báo cáo của bạn đã được gửi!
          </div>
        )}
      </form>
    </div>
  );
}

