"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ApiService from "../../../service/ApiService";
import EditCustomerModal from "./EditCustomerModal";
import toast from "react-hot-toast";
import { MoreVertical } from "lucide-react";

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

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Customer>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      const data = await ApiService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomerId(customer.customerID);
    setEditFormData({ ...customer });
    closeMenu();
  };

  const promptDelete = (id: number) => {
    setConfirmDeleteId(id);
    closeMenu();
  };

  const confirmDelete = async () => {
    if (confirmDeleteId == null) return;
    try {
      await ApiService.deleteCustomer(confirmDeleteId);
      toast.success("Xóa khách hàng thành công");
      fetchCustomers();
    } catch {
      toast.error("Lỗi khi xóa khách hàng");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const onMenuToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ x: rect.right + 4, y: rect.bottom });
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const closeMenu = () => {
    setOpenMenuId(null);
    setMenuPos(null);
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
    } catch {
      toast.error("Lỗi khi cập nhật khách hàng");
    }
  };

  // Filter + Pagination
  const filtered = customers.filter((c) =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 py-12 px-4 flex justify-center items-center" onClick={closeMenu}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 sm:p-10 space-y-8 border border-blue-100">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold italic text-blue-900 font-sans mb-2 tracking-tight drop-shadow-md">
  Quản lý khách hàng
</h1>


          <p className="text-gray-500 text-sm">Xem, chỉnh sửa và quản lý thông tin khách hàng</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          <span className="text-gray-600 text-sm mt-2 md:mt-0">
            Tổng: {filtered.length} khách hàng
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-black">
          <table className="min-w-full text-base text-gray-700">
            <thead className="bg-blue-100 text-blue-900 uppercase tracking-wider text-sm">
              <tr>
                <th className="border border-black px-4 py-3 text-left">ID</th>
                <th className="border border-black px-4 py-3 text-left">Họ tên</th>
                <th className="border border-black px-4 py-3 text-left">Email</th>
                <th className="border border-black px-4 py-3 text-left">SĐT</th>
                <th className="border border-black px-4 py-3 text-left">Giới tính</th>
                <th className="border border-black px-4 py-3 text-left">Ngày sinh</th>
                <th className="border border-black px-4 py-3 text-left">Địa chỉ</th>
                <th className="border border-black px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500 border border-black">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500 border border-black">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                paginated.map((customer, idx) => (
                  <tr
                    key={customer.customerID}
                    className={`${idx % 2 === 0 ? "bg-blue-50" : "bg-white"} hover:bg-blue-100 transition`}
                  >
                    <td className="border border-black px-4 py-3">{customer.customerID}</td>
                    <td className="border border-black px-4 py-3 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">{customer.fullName}</td>
                    <td className="border border-black px-4 py-3 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">{customer.email}</td>
                    <td className="border border-black px-4 py-3 whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis">{customer.phone}</td>
                    <td className="border border-black px-4 py-3">{customer.gender === "MALE"
                      ? "Nam"
                      : customer.gender === "FEMALE"
                      ? "Nữ"
                      : "Khác"}
                    </td>
                    <td className="border border-black px-4 py-3">{customer.dateOfBirth}</td>
                    <td className="border border-black px-4 py-3">{customer.address}</td>
                    <td className="border border-black px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          onClick={() => handleEdit(customer)}
                        >
                          Sửa
                        </button>
                        <button
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl shadow transition-transform hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            promptDelete(customer.customerID);
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>
            Trang {currentPage} / {totalPages} ({filtered.length} khách hàng)
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              ← Trước
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
            >
              Sau →
            </button>
          </div>
        </div>
        
        {/* Confirm Delete Modal */}
        {confirmDeleteId !== null &&
          createPortal(
            <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-80 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Xác nhận xóa</h2>
                <p className="mb-6 text-gray-700">Bạn có chắc chắn muốn xóa khách hàng này?</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 rounded border hover:bg-gray-100 text-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        <EditCustomerModal
          isOpen={editingCustomerId !== null}
          customer={editFormData}
          onClose={() => setEditingCustomerId(null)}
          onSave={handleModalSave}
        />
      </div>
    </div>
  );
}