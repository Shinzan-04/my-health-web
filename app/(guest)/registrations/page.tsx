"use client";

import React, { FC, useState } from "react";

const RegistrationPage: FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    address: "",
    doctor: "",
    specialty: "",
    date: "",
    session: "",
    symptom: "",
    mode: "",
    insurance: "",
    dob: "",
    note: "",
  });

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.date || !form.specialty) {
      setMessage({ text: "Vui lòng điền đầy đủ thông tin bắt buộc", type: "error" });
      return;
    }

    setMessage({ text: "Đăng ký khám thành công!", type: "success" });
    // TODO: Gửi dữ liệu lên server
  };

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
            Quý khách hàng vui lòng cung cấp thông tin chính xác để được sắp xếp lịch hẹn khám. Thời gian khám có thể thay đổi tuỳ theo tình trạng bệnh và sắp xếp của cơ sở y tế.
            <br />
            <br />
            Nếu cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng hoặc gọi trực tiếp đến số hotline của đơn vị.
            <br />
            <br />
            Trong trường hợp quý khách nghi ngờ có nguy cơ lây nhiễm HIV, hãy đến cơ sở gần nhất để được tư vấn và xét nghiệm miễn phí thông qua các chương trình “Xét nghiệm HIV miễn phí”, “Tự xét nghiệm HIV” hoặc liên hệ các trung tâm hỗ trợ gần nhất để được hỗ trợ kịp thời.
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

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 w-full">ĐĂNG KÝ KHÁM</h1>
          <p className="text-center text-gray-600 text-sm mb-6 w-full">
            Vui lòng điền thông tin vào form bên dưới để đặt đăng ký khám bệnh theo yêu cầu
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
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
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
            <div>
              <label htmlFor="gender" className="block text-gray-700 text-sm mb-1">
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
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Năm sinh */}
            <div>
              <label htmlFor="dob" className="block text-gray-700 text-sm mb-1">
                Năm sinh
              </label>
              <input
                id="dob"
                type="text"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                placeholder="VD: 1990"
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm mb-1">
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
            <div>
              <label htmlFor="address" className="block text-gray-700 text-sm mb-1">
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

            {/* Bác sĩ */}
            <div>
              <label htmlFor="doctor" className="block text-gray-700 text-sm mb-1">
                Bác sĩ
              </label>
              <input
                id="doctor"
                type="text"
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                placeholder="Nhập tên bác sĩ"
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Chuyên khoa */}
            <div>
              <label htmlFor="specialty" className="block text-gray-700 text-sm mb-1">
                Chuyên khoa <span className="text-red-500">*</span>
              </label>
              <select
                id="specialty"
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn chuyên khoa</option>
                <option value="hiv">HIV/AIDS</option>
                <option value="da-lieu">Da liễu</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Online/Offline */}
            <div>
              <label htmlFor="mode" className="block text-gray-700 text-sm mb-1">
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
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {/* Ngày khám */}
            <div>
              <label htmlFor="date" className="block text-gray-700 text-sm mb-1">
                Ngày khám <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Buổi khám */}
            <div>
              <label htmlFor="session" className="block text-gray-700 text-sm mb-1">
                Buổi khám
              </label>
              <select
                id="session"
                name="session"
                value={form.session}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn buổi</option>
                <option value="morning">Sáng</option>
                <option value="afternoon">Chiều</option>
                <option value="evening">Tối</option>
              </select>
            </div>

            {/* Bảo hiểm */}
            <div>
              <label htmlFor="insurance" className="block text-gray-700 text-sm mb-1">
                Bảo hiểm
              </label>
              <select
                id="insurance"
                name="insurance"
                value={form.insurance}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn</option>
                <option value="yes">Có</option>
                <option value="no">Không</option>
              </select>
            </div>

            {/* Triệu chứng */}
            <div className="md:col-span-2">
              <label htmlFor="symptom" className="block text-gray-700 text-sm mb-1">
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
              <label htmlFor="note" className="block text-gray-700 text-sm mb-1">
                Ghi chú
              </label>
              <textarea
                id="note"
                name="note"
                value={form.note}
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
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
