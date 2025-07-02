"use client";

import React, { FC, useState, useEffect } from "react";
import ApiService from "@/app/service/ApiService";
import { useSearchParams } from "next/navigation";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

interface Doctor {
  doctorId: number;
  fullName: string;
  phone: string;
  email: string;
}

interface schedule {
  date: string;
  slots: Slot[];
}

interface Slot {
  slotId: number;
  startTime: string;
  endTime: string;
  date: string;
  available: boolean;
  schedule?: schedule;
}

const RegistrationPage: FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    doctorEmail: "",
    specialization: "",
    mode: "",
    appointmentDate: "",
    slotId: "",
    symptom: "",
    notes: "",
    visitType: "REGISTRATION",
  });

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const doctor = doctors.find((d) => d.email === form.doctorEmail);
    if (doctor?.doctorId) {
      ApiService.getAvailableDatesByDoctor(doctor.doctorId)
        .then(setAvailableDates)
        .catch((err) => console.error("Lỗi lấy ngày có slot:", err));
    }
  }, [form.doctorEmail]);

  useEffect(() => {
    const idFromUrl = searchParams.get("doctorId");
    if (idFromUrl && doctors.length > 0) {
      const doctor = doctors.find((d) => d.doctorId.toString() === idFromUrl);
      if (doctor) {
        setForm((prev) => ({
          ...prev,
          doctorEmail: doctor.email,
        }));
      }
    }
  }, [searchParams, doctors]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await ApiService.getAllDoctors();
        setDoctors(data);
      } catch (error: any) {
        setDoctorsError(error.message || "Lỗi khi tải danh sách bác sĩ");
      } finally {
        setDoctorsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const doctor = doctors.find((d) => d.email === form.doctorEmail);
    if (doctor?.doctorId && form.appointmentDate) {
      ApiService.getSlotsByDoctorAndDate(doctor.doctorId, form.appointmentDate)
        .then(setSlots)
        .catch((err) => console.error("Lỗi khi lấy slot:", err));
    } else {
      setSlots([]);
    }
  }, [form.doctorEmail, form.appointmentDate, doctors]);

  useEffect(() => {
    if (form.visitType === "APPOINTMENT") {
      setForm((prev) => ({
        ...prev,
        mode: "Online",
        gender: "",
        dateOfBirth: "",
      }));
    }
  }, [form.visitType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsLoading(true);

    if (!form.phone || !form.appointmentDate || !form.specialization || !form.slotId) {
      setMessage({
        text: "Vui lòng điền đủ thông tin bắt buộc (SĐT, Ngày khám, Chuyên khoa, Slot)",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    const doctorId = doctors.find((d) => d.email === form.doctorEmail)?.doctorId;

    const requestBody: any = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      doctorId,
      specialization: form.specialization,
      appointmentDate: form.appointmentDate,
      slotId: parseInt(form.slotId),
      symptom: form.symptom,
      notes: form.notes,
      visitType: form.visitType,
      mode: form.mode || (form.visitType === "APPOINTMENT" ? "Online" : undefined),
    };

    if (form.visitType === "REGISTRATION") {
      requestBody.gender = form.gender.toUpperCase();
      requestBody.dateOfBirth = form.dateOfBirth;
      requestBody.address = form.address;
    }

    try {
      await ApiService.registerAppointment(requestBody);
      setMessage({ text: "Đăng ký khám thành công!", type: "success" });
      setForm({
        fullName: "",
        email: "",
        gender: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        doctorEmail: "",
        specialization: "",
        mode: "",
        appointmentDate: "",
        slotId: "",
        symptom: "",
        notes: "",
        visitType: "REGISTRATION",
      });
    } catch (error: any) {
      setMessage({
        text: error.message || "Lỗi khi gửi đăng ký.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const highlightDates = availableDates
    .map((dateStr) => {
      try {
        return parseISO(dateStr);
      } catch {
        return null;
      }
    })
    .filter((d): d is Date => d !== null);

  return (
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* LEFT: Lưu ý */}
        <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg h-fit flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-4">Lưu ý:</h2>
          <p className="text-sm leading-relaxed">
            
            Lịch hẹn có hiệu lực sau khi có xác nhận chính thức.
            <br />
            <br />
            Quý khách hàng vui lòng cung cấp thông tin chính xác để được sắp xếp
            lịch hẹn khám. Thời gian khám có thể thay đổi tuỳ theo tình trạng
            bệnh và sắp xếp của cơ sở y tế.
            <br />
            <br />
            Nếu cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng hoặc
            gọi trực tiếp đến số hotline của đơn vị.
            <br />
            <br />
            Trong trường hợp quý khách nghi ngờ có nguy cơ lây nhiễm HIV, hãy
            đến cơ sở gần nhất để được tư vấn và xét nghiệm miễn phí thông qua
            các chương trình “Xét nghiệm HIV miễn phí”, “Tự xét nghiệm HIV” hoặc
            liên hệ các trung tâm hỗ trợ gần nhất để được hỗ trợ kịp thời.
          </p>
        </div>

        {/* RIGHT: Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-600 font-bold"
            aria-label="Đóng"
            onClick={() => window.history.back()}
            type="button"
          >
            ×
          </button>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 w-full">
            ĐĂNG KÝ KHÁM
          </h1>
          <p className="text-center text-gray-600 text-sm mb-6 w-full">
            Vui lòng điền thông tin vào form bên dưới để đặt đăng ký khám bệnh
            theo yêu cầu
          </p>

          {message.text && (
            <p
              className={`text-center font-medium mb-4 w-full ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
            noValidate
          >
            {/* Họ và tên */}
            {form.visitType === "REGISTRATION" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-gray-700 text-sm mb-1"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName" // Changed name to match form state key
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Giới tính */}
            {form.visitType === "REGISTRATION" && (
              <div>
                <label
                  htmlFor="gender"
                  className="block text-gray-700 text-sm mb-1"
                >
                  Giới tính
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            )}
            {/* Năm sinh */}
            {form.visitType === "REGISTRATION" && (
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-gray-700 text-sm mb-1"
                >
                  Năm sinh
                </label>
                <input
                  id="dateOfBirth"
                  type="date" // Changed type to 'date' for better input handling
                  name="dateOfBirth" // Changed name to match form state key
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {/* Số điện thoại */}
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm mb-1"
              >
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Địa chỉ */}
            {form.visitType === "REGISTRATION" && (
              <div>
                <label
                  htmlFor="address"
                  className="block text-gray-700 text-sm mb-1"
                >
                  Địa chỉ
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                  className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {/* Bác sĩ (Dropdown) */}
            <div>
              <label
                htmlFor="doctorName"
                className="block text-gray-700 text-sm mb-1"
              >
                Bác sĩ <span className="text-red-500">*</span>
              </label>
              {doctorsLoading ? (
                <p className="text-gray-500 text-sm">
                  Đang tải danh sách bác sĩ...
                </p>
              ) : doctorsError ? (
                <p className="text-red-500 text-sm">{doctorsError}</p>
              ) : (
                <select
                  id="doctorEmail"
                  name="doctorEmail"
                  value={form.doctorEmail}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.email} value={doctor.email}>
                      {doctor.fullName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Chuyên khoa */}
            <div>
              <label
                htmlFor="specialization"
                className="block text-gray-700 text-sm mb-1"
              >
                Chuyên khoa <span className="text-red-500">*</span>
              </label>
              <select
                id="specialization"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn chuyên khoa</option>
                <option value="HIV/AIDS">HIV/AIDS</option>
                <option value="Da liễu">Da liễu</option>
                <option value="Nội tổng quát">Nội tổng quát</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Online/Offline */}
            <div>
              <label
                htmlFor="mode"
                className="block text-gray-700 text-sm mb-1"
              >
                Online/Offline
              </label>
              <select
                id="mode"
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn hình thức</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>


      {/* Chọn ngày khám */}
<div>
        <label htmlFor="appointmentDate" className="block text-gray-700 text-sm mb-1">
          Ngày khám
        </label>
    <ReactDatePicker
      selected={form.appointmentDate ? parseISO(form.appointmentDate) : null}
      onChange={(date: Date | null) => {
        setForm({
          ...form,
          appointmentDate: date ? format(date, "yyyy-MM-dd") : "",
        });
      }}
      highlightDates={highlightDates}
      dateFormat="yyyy-MM-dd"
      className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

      </div>

      {/* Buổi khám */}
      <div>
      <label htmlFor="slotId" className="block text-gray-700 text-sm mb-1">
        Khung giờ khám
      </label>
      <select
        id="slotId"
        name="slotId"
        value={form.slotId}
        onChange={handleChange}
        className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Chọn khung giờ</option>
        {slots
          .filter((s) => s.available)
          .map((s) => (
            <option key={s.slotId} value={s.slotId}>
              {s.startTime} - {s.endTime}
            </option>
          ))}
      </select>
      </div>

            {/* Loại đăng ký */}
            <div>
              <label
                htmlFor="visitType"
                className="block text-gray-700 text-sm mb-1"
              >
                Loại đăng ký <span className="text-red-500">*</span>
              </label>
              <select
                id="visitType"
                name="visitType"
                value={form.visitType}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-gray-700"
              >
                <option value="REGISTRATION">Khám bệnh</option>
                <option value="APPOINTMENT">Tư vấn</option>
              </select>
            </div>

            {/* Triệu chứng */}
            <div className="md:col-span-2">
              <label
                htmlFor="symptom"
                className="block text-gray-700 text-sm mb-1"
              >
                Triệu chứng
              </label>
              <textarea
                id="symptom"
                name="symptom"
                value={form.symptom}
                onChange={handleChange}
                placeholder="Mô tả triệu chứng (nếu có)"
                rows={3}
                className="border rounded-md px-3 py-2 w-full text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ghi chú */}
            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="block text-gray-700 text-sm mb-1"
              >
                Ghi chú
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Thêm ghi chú (nếu có)"
                rows={2}
                className="border rounded-md px-3 py-2 w-full text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nút gửi */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors font-semibold"
                disabled={isLoading || doctorsLoading} // Disable button if form is submitting or doctors are loading
              >
                {isLoading ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;