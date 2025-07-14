"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import ApiService from "@/app/service/ApiService";

interface Reminder {
  reminderId: number;
  reminderContent: string;
  reminderDate: string;
  status: string;
}

export default function UserPanel() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersError, setRemindersError] = useState<string | null>(null);

  const fetchReminders = async () => {
    try {
      setRemindersLoading(true);
      const data: Reminder[] = await ApiService.getAllMyReminders();
      setReminders(data);
    } catch (err: any) {
      console.error("Lỗi khi tải nhắc nhở:", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setRemindersError("Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setRemindersError("Không thể tải nhắc nhở. " + (err?.message || ""));
      }
    } finally {
      setRemindersLoading(false);
    }
  };

  const handleMarkAsDone = async (reminderId: number) => {
    try {
      await ApiService.markReminderDone(reminderId);
      await fetchReminders();
    } catch (err: any) {
      console.error("Lỗi khi đánh dấu đã xong:", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setRemindersError("Phiên đăng nhập đã hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
        /*setTimeout(() => {
          window.location.href = "/login";
        }, 2000);*/
      } else {
        setRemindersError("Không thể cập nhật trạng thái nhắc nhở. " + (err?.message || ""));
      }
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

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
                  key={reminder.reminderId}
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
                      Trạng thái:{" "}
                      <span className={`font-semibold ${reminder.status === "DONE" ? "text-green-600" : "text-orange-500"}`}>
                        {reminder.status === "DONE" ? "Đã xong" : "Chờ xử lý"}
                      </span>
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
