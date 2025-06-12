"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

type Props = {
  isOpen: boolean;
  doctor: Partial<Doctor>;
  onClose: () => void;
  onSave: (data: Partial<Doctor>) => void;
};

type Doctor = {
  doctorId: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  description: string;
  work_experience_years: number;
};

export default function EditDoctorModal({ isOpen, doctor, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<Partial<Doctor>>({});

  useEffect(() => {
    setFormData(doctor);
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
<Dialog
  open={isOpen}
  onClose={onClose}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all"
>
  <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-[fadeIn_0.2s_ease-out_forwards]">
    {/* Nội dung modal */}
  </div>

  {/* Modal content */}
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md">
      <Dialog.Title className="text-xl font-bold mb-4 text-gray-900">
        Chỉnh sửa thông tin
      </Dialog.Title>

          <div className="space-y-3 text-gray-900">
            <input
              name="Họ và Tên"
              value={formData.fullName || ""}
              onChange={handleChange}
              placeholder="Họ tên"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />
            <input
              name="Email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />
            <input
              name="Phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />
            <input
              name="Chuyên môn"
              value={formData.specialization || ""}
              onChange={handleChange}
              placeholder="Chuyên môn"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />
                        <input
              name="Kinh nghiệm làm việc"
              value={formData.work_experience_years || ""}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />
            <textarea
              name="Mô tả"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Mô tả"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />

          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded transform transition-transform hover:scale-105">Hủy</button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded transform transition-transform hover:scale-105">Lưu</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
