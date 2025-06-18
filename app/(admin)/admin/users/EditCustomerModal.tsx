"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

type Props = {
  isOpen: boolean;
  customer: Partial<Customer>;
  onClose: () => void;
  onSave: (data: Partial<Customer>) => void;
};

type Customer = {
  customerID: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  description?: string;
};

export default function EditCustomerModal({
  isOpen,
  customer,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<Partial<Customer>>({});

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4 text-gray-900">
            Chỉnh sửa thông tin khách hàng
          </Dialog.Title>

          <div className="space-y-3 text-gray-900">
            <input
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              placeholder="Họ tên"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />

            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />

            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />

            <input
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              placeholder="Giới tính"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />

            <input
              name="dob"
              type="date"
              value={formData.dob || ""}
              onChange={handleChange}
              placeholder="Ngày sinh"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />

            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Địa chỉ"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Mô tả"
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />
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