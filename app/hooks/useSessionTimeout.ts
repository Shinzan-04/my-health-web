// hooks/useSessionTimeout.ts
import { useEffect } from "react";
import { isSessionExpired, updateLastActivity, clearSession } from "@/app/utils/sessionManager";

export default function useSessionTimeout() {
  useEffect(() => {
    const checkSession = () => {
      if (isSessionExpired()) {
        clearSession();
        window.location.href = "/login";
      }
    };

    const handleActivity = () => {
      updateLastActivity();
    };

    // Lắng nghe các hành vi của user
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    updateLastActivity();

    // Kiểm tra session mỗi 30s
    const interval = setInterval(checkSession, 30000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearInterval(interval);
    };
  }, []);
}
