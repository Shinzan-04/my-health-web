import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="p-6 bg-gray-50 min-h-screen space-y-6">
      {children}
    </section>
  );
}