"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";

interface Reminder {
  id: number;
  reminderContent: string;
  reminderDate: string;
  status: string;
}

export default function UserPanel() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersError, setRemindersError] = useState<string | null>(null);

  const getAuthToken = () => {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        return authData.token;
      } catch (e) {
        console.error("Lỗi đọc token từ localStorage:", e);
        return null;
      }
    }
    const directToken = localStorage.getItem("token");
    if (directToken) {
      console.warn("Token found directly in localStorage. Consider wrapping it in an object like authData.");
      return directToken;
    }
    return null;
  };

  const fetchReminders = async () => {
    const token = getAuthToken();
    if (!token) {
      setRemindersError("Bạn chưa đăng nhập hoặc token không hợp lệ. Vui lòng đăng nhập lại.");
      setRemindersLoading(false);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    try {
      setRemindersLoading(true);
      setRemindersError(null);

      const res = await fetch("http://localhost:8080/api/reminders/all/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.");
        }
        const errorBody = await res.json().catch(() => ({ message: `Lỗi không xác định (${res.status})` }));
        throw new Error(errorBody.message || `Không thể tải nhắc nhở. Mã lỗi: ${res.status}`);
      }

      const data: Reminder[] = await res.json();
      setReminders(data);
    } catch (err: any) {
      console.error("Lỗi khi tải nhắc nhở:", err);
      if (err.message.includes("Failed to fetch") || err instanceof TypeError) {
        setRemindersError("Lỗi kết nối mạng. Vui lòng kiểm tra server hoặc URL.");
      } else {
        setRemindersError(err.message);
      }
    } finally {
      setRemindersLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleMarkAsDone = async (id: number) => {
    const token = getAuthToken();
    if (!token) {
      setRemindersError("Không có token xác thực để cập nhật nhắc nhở.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/reminders/${id}/done`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Phiên đăng nhập đã hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
        }
        const errorBody = await res.json().catch(() => ({ message: `Lỗi cập nhật không xác định (${res.status})` }));
        throw new Error(errorBody.message || "Không thể cập nhật trạng thái nhắc nhở.");
      }

      fetchReminders();
    } catch (err: any) {
      console.error("Lỗi khi đánh dấu đã xong:", err);
      setRemindersError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <main className="pt-24 md:pt-28 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Bell className="mr-3 text-blue-600" size={32} />
            Hệ thống nhắc nhở
          </h2>

          {remindersLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải nhắc nhở...</p>
            </div>
          ) : remindersError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
              <strong className="font-bold">Lỗi: </strong>
              <span className="block sm:inline">{remindersError}</span>
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-lg">Bạn chưa có nhắc nhở nào.</p>
              <p className="text-gray-500 text-sm mt-2">Hãy tạo nhắc nhở mới để quản lý công việc của bạn.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                    reminder.status === "DONE" ? "border-green-500 opacity-70" : "border-blue-500"
                  } flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{reminder.reminderContent}</h3>
                    <p className="text-gray-600 text-sm mb-1">
                      Ngày nhắc nhở: <span className="font-medium">{reminder.reminderDate}</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Trạng thái: <span className={`font-semibold ${reminder.status === "DONE" ? "text-green-600" : "text-orange-500"}`}>{reminder.status === "DONE" ? "Đã xong" : "Chờ xử lý"}</span>
                    </p>
                  </div>
                  {reminder.status !== "DONE" && (
                    <button
                      onClick={() => handleMarkAsDone(reminder.id)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center self-start"
                    >
                      <CheckCircle size={18} className="mr-2" /> Đánh dấu đã xong
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out forwards;
        }
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
