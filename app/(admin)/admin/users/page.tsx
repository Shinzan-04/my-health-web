"use client";

import { useEffect, useState } from "react";
import ApiService from "../../../service/ApiService";
import EditCustomerModal from "./EditCustomerModal";
import toast from "react-hot-toast";
import { FilePen, Trash } from "lucide-react";

type Customer = {
  customerID: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string; // Đổi từ dob sang dateOfBirth
  address: string;
  description?: string;
};

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Customer>>({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
     try {
          const data = await ApiService.getAllCustomers();
          setCustomers(data);
        } catch (err) {
          console.error("Lỗi khi lấy danh sách người dùng:", err);
        }
      };

  const handleEdit = (customer: Customer) => {
    setEditingCustomerId(customer.customerID);
    setEditFormData({ ...customer });
  };

  const handleDelete = async (customerID: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return;
    try {
      await ApiService.deleteCustomer(customerID);
      toast.success("Xóa khách hàng thành công");
      fetchCustomers();
    } catch (err) {
      toast.error("Lỗi khi xóa khách hàng");
    }
  };

   const handleModalSave = async (data: any) => {
      if (!editingCustomerId) return;
      try {
        await ApiService.updateCustomerNoAvatar(editingCustomerId, data);
        toast.success("Cập nhật thành công!", {
    icon: "🎉",
    style: {
      borderRadius: "8px",
      background: "#f0fdf4",
      color: "#16a34a",
    },
  });

      setEditingCustomerId(null);
      fetchCustomers();
    } catch (err) {
      toast.error("Lỗi khi cập nhật khách hàng");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Quản lý khách hàng</h1>

      <div className="overflow-x-auto rounded border border-gray-400 shadow-sm bg-white">
        <table className="min-w-full text-sm text-gray-900">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border border-gray-400 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Họ tên</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-400 px-4 py-2 text-left">SĐT</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Giới tính</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Ngày sinh</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Địa chỉ</th>
 
              <th className="border border-gray-400 px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerID} className="hover:bg-gray-100">
                <td className="border border-gray-400 px-4 py-2">{customer.customerID}</td>
                <td className="border border-gray-400 px-4 py-2">{customer.fullName}</td>
                <td className="border border-gray-400 px-4 py-2">{customer.email}</td>
                <td className="border border-gray-400 px-4 py-2">{customer.phone}</td>
                <td className="border border-gray-400 px-4 py-2">
                {customer.gender === "MALE"
                ? "Nam"
                : customer.gender === "FEMALE"
                ? "Nữ"
                : "Khác"}
                </td>

                <td className="border border-gray-400 px-4 py-2">{customer.dateOfBirth}</td>
                <td className="border border-gray-400 px-4 py-2">{customer.address}</td>
               
                <td className="border border-gray-400 px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transform transition-transform hover:scale-105"
                      onClick={() => handleEdit(customer)}
                    >
                      <FilePen size={16} />
                      Sửa
                    </button>
                    <button
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transform transition-transform hover:scale-105"
                      onClick={() => handleDelete(customer.customerID)}
                    >
                      <Trash size={16} />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditCustomerModal
        isOpen={editingCustomerId !== null}
        customer={editFormData}
        onClose={() => setEditingCustomerId(null)}
        onSave={handleModalSave}
      />
    </div>
  );
}