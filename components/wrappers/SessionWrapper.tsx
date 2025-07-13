// app/components/wrappers/SessionWrapper.tsx
"use client";

import { useEffect } from "react";
import useSessionTimeout from "@/app/hooks/useSessionTimeout";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  useSessionTimeout();

  // Optionally check if authData exists:
  useEffect(() => {
    const auth = localStorage.getItem("authData");
    if (!auth) {
      window.location.href = "/login";
    }
  }, []);

  return <>{children}</>;
}
