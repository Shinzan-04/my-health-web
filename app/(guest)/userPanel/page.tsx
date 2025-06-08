"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface Reminder {
  id: number;
  reminderContent: string;
  reminderDate: string;
  status: string;
  // Bạn có thể thêm các trường khác nếu cần từ backend, ví dụ:
  // customer: { customerId: number, email: string };
  // arvRegimen: { arvRegimenId: number, regimenName: string };
}

export default function UserPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersError, setRemindersError] = useState<string | null>(null);

  // Hàm để lấy token từ localStorage (chỉ cần token cho API /all/me)
  const getAuthToken = () => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        const parsedAuthData = JSON.parse(authData);
        // Đảm bảo rằng parsedAuthData.token tồn tại và là một chuỗi.
        // Nếu không có 'token' trong authData (do backend chưa trả về),
        // thì parsedAuthData.token sẽ là undefined, và hàm này sẽ trả về null.
        return parsedAuthData.token;
      } catch (e) {
        console.error("Lỗi khi đọc authData từ localStorage hoặc parse JSON", e);
        return null;
      }
    }
    return null;
  };

  // Hàm để lấy customerId từ localStorage (nếu cần)
  // Lưu ý: Đối với API /all/me, backend tự lấy customerId từ token,
  // nhưng nếu bạn muốn hiển thị nó trên UI hoặc dùng cho API khác,
  // bạn vẫn cần nó được trả về từ API login và lưu vào localStorage.
  const getCustomerIdFromLocalStorage = () => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        const parsedAuthData = JSON.parse(authData);
        return parsedAuthData.customerId; // Giả định backend trả về customerId
      } catch (e) {
        console.error("Lỗi khi đọc authData từ localStorage hoặc parse JSON", e);
        return null;
      }
    }
    return null;
  };

  // Effect để fetch reminders khi component mount
  const fetchReminders = async () => {
    const token = getAuthToken();
    if (!token) {
      setRemindersError("Bạn chưa đăng nhập hoặc token không hợp lệ.");
      setRemindersLoading(false);
      return;
    }

    try {
      setRemindersLoading(true);
      setRemindersError(null);
      // Gửi yêu cầu đến endpoint /all/me
      const response = await fetch(`http://localhost:8080/api/reminders/all/me`, {
        headers: {
          'Authorization': `Bearer ${token}`, // THÊM HEADER XÁC THỰC
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Kiểm tra lỗi 401/403 để xử lý token hết hạn/không có quyền
        if (response.status === 401 || response.status === 403) {
            throw new Error("Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.");
        }
        throw new Error(`Không thể tải nhắc nhở. Mã lỗi: ${response.status} ${response.statusText}`);
      }
      const data: Reminder[] = await response.json();
      setReminders(data); // Hiển thị toàn bộ danh sách nhắc nhở (không lọc status DONE hay slice)
    } catch (error: any) {
      // Cập nhật phần xử lý lỗi để cung cấp thông báo cụ thể hơn
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setRemindersError("Lỗi kết nối mạng: Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra lại server có đang chạy không.");
      } else {
        setRemindersError(error.message);
      }
      console.error("Lỗi khi tải nhắc nhở:", error);
    } finally {
      setRemindersLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []); // Chỉ chạy một lần khi component mount

  // Hàm handleMarkAsDone cũng cần gửi token
  const handleMarkAsDone = async (reminderId: number) => { // <-- reminderId được truyền vào đây như một tham số
    const token = getAuthToken();
    if (!token) {
      setRemindersError("Bạn chưa đăng nhập.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/reminders/${reminderId}/done`, { // <-- reminderId được sử dụng ở đây
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // THÊM HEADER XÁC THỰC
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.");
        }
        throw new Error("Không thể cập nhật trạng thái nhắc nhở.");
      }

      // Sau khi cập nhật thành công, fetch lại danh sách để đảm bảo dữ liệu mới nhất
      fetchReminders(); // Tải lại danh sách
      console.log(`Reminder ${reminderId} marked as DONE successfully.`);
    } catch (error: any) {
      // Cập nhật phần xử lý lỗi để cung cấp thông báo cụ thể hơn
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setRemindersError("Lỗi kết nối mạng: Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra lại server có đang chạy không.");
      } else {
        setRemindersError(error.message);
      }
      console.error("Lỗi khi đánh dấu nhắc nhở là Đã xong:", error);
    } finally {
      setRemindersLoading(false);
    }
  };

  const navLinks = [
    { label: "Trang Chủ", href: "/home" },
    { label: "Bác Sĩ", href: "/doctor" },
    { label: "Đặt Lịch", href: "/booking" },
    { label: "Liên Hệ", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];

  const profileMenuItems = [
    { label: "Chỉnh sửa hồ sơ", id: "edit-profile", href: "/profile/edit" },
    { label: "Kết quả xét nghiệm (CD4, tải lượng HIV, ARV)", id: "lab-results", href: "/lab-results" },
    { label: "Lịch sử khám bệnh", id: "medical-history", href: "/medical-history" },
    { label: "Hệ thống nhắc uống thuốc, tái khám", id: "reminder-system", href: "/reminders" },
  ];

  const handleLogout = () => {
    console.log("Đăng xuất");
    localStorage.removeItem('authData'); // Xóa token và bất kỳ dữ liệu xác thực nào
    window.location.href = "/login"; // Redirect về trang đăng nhập
  };

  return (
    // !!! RẤT QUAN TRỌNG: Đảm bảo có cặp Fragment này để bao bọc tất cả các phần tử JSX cấp cao nhất
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
        <div className="w-full px-8 py-6 flex justify-between items-center">
          {/* Logo */}
          <a href="/home" className="flex items-center space-x-3">
            <img src="https://placehold.co/100xauto/879FC5/FFFFFF?text=Logo" alt="Logo" className="w-[100px] h-auto rounded-md" />
            <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
              HIV Treatment and Medical
            </h1>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Avatar + Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
              >
                <img
                  src="https://placehold.co/40x40/CCCCCC/333333?text=Avatar"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg z-50 p-2">
                  <ul className="profile-menu space-y-1">
                    {profileMenuItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          data-content-id={item.id}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 pb-6 space-y-4">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
              >
                {label}
              </a>
            ))}

            {/* Avatar Mobile Menu */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="https://placehold.co/40x40/CCCCCC/333333?text=Avatar"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="font-medium text-gray-800">Tài Khoản</span>
              </div>
              <ul className="profile-menu space-y-1">
                {profileMenuItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      data-content-id={item.id}
                      className="block text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <hr className="my-3" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Reminder Widget Section */}
      <main className="pt-32 pb-10 px-4 md:px-8 bg-gray-100 min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách tất cả nhắc nhở của bạn</h2> {/* Đổi tiêu đề */}
            {remindersLoading ? (
              <p className="text-gray-600">Đang tải nhắc nhở...</p>
            ) : remindersError ? (
              <p className="text-red-600">Lỗi: {remindersError}</p>
            ) : reminders.length === 0 ? (
              <p className="text-gray-600">Bạn không có nhắc nhở nào.</p>
            ) : (
              <ul className="space-y-3">
                {reminders.map((reminder) => (
                  <li key={reminder.id} className="bg-blue-50 p-3 rounded-md border border-blue-200 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-blue-800">{reminder.reminderContent}</p>
                      <p className="text-sm text-gray-600">
                        Ngày: {new Date(reminder.reminderDate).toLocaleDateString()} lúc{" "}
                        {new Date(reminder.reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                       <p className="text-sm text-gray-600">Trạng thái: {reminder.status}</p>
                    </div>
                    {/* Nút "Đã uống" chỉ hiển thị nếu trạng thái KHÔNG phải 'DONE' */}
                    {reminder.status !== 'DONE' && (
                        <button
                            onClick={() => handleMarkAsDone(reminder.id)} // Pass reminder.id here
                            className="ml-4 px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            Đã uống
                        </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Other dashboard content can go here */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Các nội dung khác</h2>
            <p className="text-gray-600">Đây là nơi bạn có thể thêm các widget hoặc thông tin khác cho trang chủ/dashboard của người dùng.</p>
          </div>
        </div>
      </main>
    </>
  );
}
