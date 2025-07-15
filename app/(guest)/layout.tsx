// app/(guest)/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import "../styles/globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import PosterCarousel from "@/components/sliders/Poster";
import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface RootLayoutProps {
  children: ReactNode;
}

const GuestLayout: FC<RootLayoutProps> = ({ children }) => {
  const path = usePathname();
  const isReg = path.startsWith("/registrations");
  const isReg01 = path.startsWith("/list-doctor");

  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-gray-50 pt-[130px]">
        <Header />
        <Toaster position="top-center" />

        {!isReg && !isReg01 && <PosterCarousel />}

        <main className="flex-grow">{children}</main>

        {!isReg && <Footer />}
      </body>
    </html>
  );
};

export default GuestLayout;
