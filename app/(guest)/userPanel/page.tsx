"use client";

import { useState, useEffect } from "react"; // Import useEffect
// import Link from "next/link"; // Removed: Using <a> tag for broader compatibility
import { Menu, X } from "lucide-react";

// Define a type for Reminder for better type safety
interface Reminder {
  id: number;
  reminderContent: string;
  reminderDate: string; // Assuming ISO string from backend (LocalDateTime)
  status: string; // "PENDING", "SENT"
  // Add other reminder properties if needed
}

export default function UserPanel() { // Changed function name to PascalCase for convention
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // State for reminders widget
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersError, setRemindersError] = useState<string | null>(null);

  // Placeholder customerId - You should replace this with the actual logged-in user's ID
  // This would typically come from an authentication context or a global state management solution.
  const customerId = 1; // Example customer ID

  // Effect to fetch reminders when the component mounts or customerId changes
  useEffect(() => {
    const fetchReminders = async () => {
      if (!customerId) {
        setRemindersError("Không tìm thấy ID khách hàng.");
        setRemindersLoading(false);
        return;
      }

      try {
        setRemindersLoading(true);
        setRemindersError(null);
        // Using the API endpoint to get today's pending reminders for a customer
        const response = await fetch(`http://localhost:8080/api/reminders/today/customer/${customerId}`);
        if (!response.ok) {
          throw new Error("Không thể tải nhắc nhở.");
        }
        const data: Reminder[] = await response.json();
        setReminders(data);
      } catch (error: any) {
        setRemindersError(error.message);
        console.error("Lỗi khi tải nhắc nhở:", error);
      } finally {
        setRemindersLoading(false);
      }
    };

    fetchReminders();
  }, [customerId]); // Re-fetch if customerId changes

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
    { label: "Hệ thống nhắc uống thuốc, tái khám", id: "reminder-system", href: "/reminders" }, // Link to a dedicated reminders page
  ];

  const handleLogout = () => {
    // Replace with actual logout logic (e.g., clearing tokens, redirecting)
    console.log("Đăng xuất");
    // Example: window.location.href = "/logout";
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
        <div className="w-full px-8 py-6 flex justify-between items-center">
          {/* Logo */}
          <a href="/home" className="flex items-center space-x-3"> {/* Changed Link to <a> */}
            <img src="https://placehold.co/100xauto/879FC5/FFFFFF?text=Logo" alt="Logo" className="w-[100px] h-auto rounded-md" /> {/* Placeholder image */}
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
                          href={item.href} // Use item.href for navigation
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
                    onClick={handleLogout} // Call handleLogout function
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
                      href={item.href} // Use item.href for navigation
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
                onClick={handleLogout} // Call handleLogout function
                className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Reminder Widget Section */}
      <main className="pt-32 pb-10 px-4 md:px-8 bg-gray-100 min-h-[calc(100vh-80px)]"> {/* Added padding-top to account for fixed header */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nhắc nhở của bạn</h2>
            {remindersLoading ? (
              <p className="text-gray-600">Đang tải nhắc nhở...</p>
            ) : remindersError ? (
              <p className="text-red-600">Lỗi: {remindersError}</p>
            ) : reminders.length === 0 ? (
              <p className="text-gray-600">Bạn không có nhắc nhở nào đến hạn hôm nay.</p>
            ) : (
              <ul className="space-y-3">
                {reminders.slice(0, 3).map((reminder) => ( // Display top 3 reminders
                  <li key={reminder.id} className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <p className="font-semibold text-blue-800">{reminder.reminderContent}</p>
                    <p className="text-sm text-gray-600">
                      Ngày: {new Date(reminder.reminderDate).toLocaleDateString()} lúc{" "}
                      {new Date(reminder.reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </li>
                ))}
                {reminders.length > 3 && (
                  <li className="text-center pt-2">
                    <a
                      href="/reminders" // Link to a dedicated reminders page
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Xem tất cả ({reminders.length})
                    </a>
                  </li>
                )}
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
