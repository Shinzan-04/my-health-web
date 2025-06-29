import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
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

        {/* Main content container không có sidebar */}
        <div className="flex flex-1 pt-[64px]">
          <div className="flex-1 flex flex-col w-full">
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
