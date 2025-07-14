"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

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
  workExperienceYears: number;
};

export default function EditDoctorModal({
  isOpen,
  doctor,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<Partial<Doctor>>({});

  useEffect(() => {
    setFormData(doctor);
  }, [doctor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "workExperienceYears" ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc.", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
          <Dialog.Title className="text-xl font-bold mb-4 text-gray-900">
            Chỉnh sửa thông tin bác sĩ
          </Dialog.Title>

          <div className="space-y-4 text-gray-900">
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên </label>
              <input
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 px-3 py-2 rounded"
              />
            </div>

       <div>
              <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={formData.email || ""}
              readOnly
              className="w-full border border-gray-400 px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại 
              </label>
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Chuyên môn
              </label>
              <input
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số năm kinh nghiệm
              </label>
              <input
                name="workExperienceYears"
                type="number"
                min={0}
                value={formData.workExperienceYears || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 px-3 py-2 rounded resize-none min-h-[100px]"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded transform transition-transform hover:scale-105"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded transform transition-transform hover:scale-105"
            >
              Lưu
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
