"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ApiService from "@/app/service/ApiService";
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
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Customer>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Menu & confirm-delete
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.includes(term)
      )
    );
    setCurrentPage(1);
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      const data = await ApiService.getAllCustomers();
      setCustomers(data);
    } catch {
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

  const cancelDelete = () => setConfirmDeleteId(null);

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

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6" onClick={closeMenu}>
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email, SĐT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-300 shadow bg-white">
        {loading ? (
          <div className="text-center py-6 text-gray-600">Đang tải dữ liệu khách hàng...</div>
        ) : (
          <table className="min-w-[1200px] w-full text-sm text-gray-900">
            <thead className="bg-white border-b border-gray-300">
              <tr className="uppercase text-gray-800 font-semibold tracking-wide">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Họ tên</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">SĐT</th>
                <th className="px-4 py-2 text-left">Giới tính</th>
                <th className="px-4 py-2 text-left">Ngày sinh</th>
                <th className="px-4 py-2 text-left">Địa chỉ</th>
                <th className="px-4 py-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                paginated.map((customer, idx) => (
                  <tr
                    key={customer.customerID}
                    className={`${idx % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition`}
                  >
                    <td className="px-4 py-2">{customer.customerID}</td>
                    <td className="px-4 py-2">{customer.fullName}</td>
                    <td className="px-4 py-2">{customer.email}</td>
                    <td className="px-4 py-2">{customer.phone}</td>
                    <td className="px-4 py-2">
                      {customer.gender === "MALE"
                        ? "Nam"
                        : customer.gender === "FEMALE"
                        ? "Nữ"
                        : "Khác"}
                    </td>
                    <td className="px-4 py-2">{customer.dateOfBirth}</td>
                    <td className="px-4 py-2">{customer.address}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={(e) => onMenuToggle(e, customer.customerID)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical size={20} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
          >
            Sau →
          </button>
        </div>
      </div>

      {/* Menu Portal */}
      {menuPos &&
        openMenuId &&
        createPortal(
          <div
            style={{ position: "fixed", top: menuPos.y, left: menuPos.x }}
            className="w-32 bg-white border border-gray-200 rounded shadow-lg z-50"
          >
            <button
              onClick={() => handleEdit(customers.find((c) => c.customerID === openMenuId)!)}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-blue-700"
            >
              Sửa
            </button>
            <button
              onClick={() => promptDelete(openMenuId)}
              className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Xóa
            </button>
          </div>,
          document.body
        )}

      {/* Edit Modal */}
      <EditCustomerModal
        isOpen={editingCustomerId !== null}
        customer={editFormData}
        onClose={() => setEditingCustomerId(null)}
        onSave={handleModalSave}
      />

      {/* Confirm Delete Modal */}
      {confirmDeleteId !== null &&
        createPortal(
          <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50 ">
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
    </div>
  );
}