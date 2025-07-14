"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ApiService from "@/app/service/ApiService";
import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  imageUrl?: string;
  doctorId?: number;
  doctorName?: string;
};

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null | undefined>(null);

  useEffect(() => {
    const getBlog = async () => {
      try {
        const data = await ApiService.getBlogById(Number(id));
        const blogData: BlogPost = { ...data };

        if (blogData.doctorId) {
          try {
            const d = await ApiService.getDoctorById(blogData.doctorId);
            blogData.doctorName = d.fullName;
          } catch {
            blogData.doctorName = "Không rõ";
          }
        } else {
  blogData.doctorName = "Admin"; // nếu không có doctorId → do Admin đăng
}


        setBlog(blogData);
      } catch {
        setBlog(undefined);
      }
    };
    getBlog();
  }, [id]);

  if (blog === undefined)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Không tìm thấy bài viết.
      </div>
    );

  if (!blog)
    return (
      <div className="p-6 text-center text-gray-600">Đang tải bài viết...</div>
    );

 return (
  <div className="max-w-5xl mx-auto px-4 py-10 text-gray-800">
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200">
      {/* Ảnh đại diện blog */}
      {blog.imageUrl && (
        <div className="w-full">
          <img
            src={`http://localhost:8080${blog.imageUrl}`}
            alt="thumbnail"
            className="w-full max-h-[420px] object-cover border-b"
          />
        </div>
      )}

      {/* Nội dung chi tiết */}
      <div className="p-6 sm:p-8">
        {/* Tiêu đề */}
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4 leading-snug">
          {blog.title}
        </h1>

        {/* Thông tin */}
        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-x-4 gap-y-2">
          <span>🕒 {new Date(blog.createdAt).toLocaleString("vi-VN")}</span>
          <span>👨‍⚕️ <span className="font-semibold text-gray-800">{blog.doctorName}</span></span>
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">#{blog.tag}</span>
        </div>

        {/* Nội dung bài viết */}
        <article className="prose prose-lg max-w-none text-justify text-gray-800 leading-relaxed whitespace-pre-wrap">
          {blog.content}
        </article>

        {/* Quay lại */}
        <div className="mt-10 text-right">
          <Link
            href="/blog"
            className="inline-block text-sm px-5 py-2 bg-gray-100 hover:bg-gray-200 text-blue-700 rounded-lg transition"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  </div>
);


}
