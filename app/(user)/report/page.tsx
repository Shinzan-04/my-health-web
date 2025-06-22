
        "use client";

        import { useState } from "react";

        export default function ReportPage() {
          const [patientName, setPatientName] = useState("");
          const [appointmentDate, setAppointmentDate] = useState("");
          const [doctorName, setDoctorName] = useState("");
          const [serviceRating, setServiceRating] = useState(0);
          const [serviceComment, setServiceComment] = useState("");
          const [doctorRating, setDoctorRating] = useState(0);
          const [doctorComment, setDoctorComment] = useState("");
          const [facilityRating, setFacilityRating] = useState(0);
          const [facilityComment, setFacilityComment] = useState("");
          const [suggestion, setSuggestion] = useState("");
          const [submitted, setSubmitted] = useState(false);

          const handleStarClick = (
            setter: (v: number) => void,
            value: number
          ) => {
            setter(value);
          };

          const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setSubmitted(true);
            // TODO: Gửi dữ liệu về server tại đây
            alert("Cảm ơn bạn đã đánh giá!");
          };

          return (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
              <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
                Đánh Giá Buổi Khám
              </h1>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-semibold mb-1" htmlFor="patientName">
                    Họ và tên:
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" htmlFor="appointmentDate">
                    Ngày khám:
                  </label>
                  <input
                    id="appointmentDate"
                    type="date"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" htmlFor="doctorName">
                    Bác sĩ:
                  </label>
                  <input
                    id="doctorName"
                    type="text"
                    value={doctorName}
                    onChange={e => setDoctorName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Đánh giá chất lượng dịch vụ:
                  </label>
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl cursor-pointer ${
                          serviceRating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => handleStarClick(setServiceRating, star)}
                        role="button"
                        aria-label={`Đánh giá ${star} sao`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    value={serviceComment}
                    onChange={e => setServiceComment(e.target.value)}
                    placeholder="Nhận xét về dịch vụ..."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Đánh giá bác sĩ:
                  </label>
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl cursor-pointer ${
                          doctorRating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => handleStarClick(setDoctorRating, star)}
                        role="button"
                        aria-label={`Đánh giá ${star} sao`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    value={doctorComment}
                    onChange={e => setDoctorComment(e.target.value)}
                    placeholder="Nhận xét về bác sĩ..."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Đánh giá cơ sở vật chất:
                  </label>
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl cursor-pointer ${
                          facilityRating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => handleStarClick(setFacilityRating, star)}
                        role="button"
                        aria-label={`Đánh giá ${star} sao`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    value={facilityComment}
                    onChange={e => setFacilityComment(e.target.value)}
                    placeholder="Nhận xét về cơ sở vật chất..."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" htmlFor="suggestion">
                    Đề xuất cải thiện:
                  </label>
                  <textarea
                    id="suggestion"
                    value={suggestion}
                    onChange={e => setSuggestion(e.target.value)}
                    placeholder="Ý kiến đóng góp..."
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                  Gửi Đánh Giá
                </button>
                {submitted && (
                  <div className="text-green-600 text-center mt-2">
                    Cảm ơn bạn đã đánh giá!
                  </div>
                )}
              </form>
            </div>
          );
        }

