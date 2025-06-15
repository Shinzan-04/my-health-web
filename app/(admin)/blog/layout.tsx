import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Sidebar from "@/components/sidebar/Sidebar";
import { FC, ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Y Tế - Thông tin sức khỏe, kiến thức y khoa",
  description:
    "Khám phá bài viết, chia sẻ từ bác sĩ và thông tin y tế chính thống.",
};

interface BlogLayoutProps {
  children: ReactNode;
}

const BlogLayout: FC<BlogLayoutProps> = ({ children }) => {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />

        {/* Main layout container (Sidebar + Content) */}
        <div className="flex flex-1 pt-[64px]">
          {/* Fixed Sidebar */}
          <aside className="w-64 fixed top-[64px] left-0 h-[calc(100vh-64px)] bg-white border-r z-40 pt-4">
            <Sidebar />
          </aside>

          {/* Main content */}
          <div className="ml-64 flex-1 flex flex-col">
            <main className="flex-1 p-4 pt-[64px] bg-gray-50 overflow-auto">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
};

export default BlogLayout;
