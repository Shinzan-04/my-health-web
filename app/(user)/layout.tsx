import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Sidebar from "@/components/sidebar/Sidebar";
import SessionWrapper from "@/components/wrappers/SessionWrapper"; // <== thêm dòng này
import { FC, ReactNode } from "react";
import DoctorCardList from "@/components/cards/DoctorCardList";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Y Tế Thông Minh - Chăm sóc sức khỏe toàn diện",
  description: "Nền tảng quản lý sức khỏe, hỗ trợ đặt lịch khám và theo dõi bệnh án dễ dàng.",
};

interface RootLayoutProps {
  children: ReactNode;
}

const HomeLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />

        <SessionWrapper>
          {/* Main layout container (Sidebar + Content) */}
          <div className="flex flex-1 pt-[64px]">
            <aside className="w-64 fixed top-[64px] left-0 h-[calc(100vh-64px)] bg-white border-r z-40 pt-4">
              <Sidebar />
            </aside>
            <div className="ml-64 flex-1 flex flex-col">
              <main className="flex-1 p-4 pt-[64px] bg-gray-50 overflow-auto">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
};

export default HomeLayout;
