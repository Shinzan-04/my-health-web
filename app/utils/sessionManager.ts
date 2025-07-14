// utils/sessionManager.ts
export const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 phút

export const updateLastActivity = () => {
  localStorage.setItem("lastActivity", Date.now().toString());
};

export const isSessionExpired = () => {
  const last = localStorage.getItem("lastActivity");
  if (!last) return true;
  return Date.now() - parseInt(last) > SESSION_TIMEOUT;
};

export const clearSession = () => {
  localStorage.removeItem("authData");
  localStorage.removeItem("lastActivity");
};
