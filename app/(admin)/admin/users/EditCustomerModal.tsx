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
  dateOfBirth: string;
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
    setFormData(customer || {});
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Họ tên:
              </label>
              <input
                name="fullName"
                value={formData.fullName ?? ""}
                onChange={handleChange}
                placeholder="Họ tên"
                className="w-full border border-gray-400 px-3 py-2 rounded"
              />
            </div>

              <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email ?? ""}
                readOnly
                disabled
                className="w-full border border-gray-200 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Số điện thoại:
              </label>
              <input
                name="phone"
                value={formData.phone ?? ""}
                onChange={(e) => {
                  // Chỉ cho phép số, tối đa 10 ký tự
                  const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData((prev) => ({ ...prev, phone: onlyNums }));
                }}
                placeholder="Số điện thoại"
                className="w-full border border-gray-400 px-3 py-2 rounded"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Giới tính:
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 px-3 py-2 rounded"
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Ngày sinh:
              </label>
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={handleChange}
                className="w-full border border-gray-400 px-3 py-2 rounded"
              />
            </div>

               <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Địa chỉ:
              </label>
              <input
                name="address"
                value={formData.address ?? ""}
                onChange={handleChange}
                placeholder="Địa chỉ"
                className="w-full border border-gray-400 px-3 py-2 rounded"
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