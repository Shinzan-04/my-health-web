"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Doctor {
  id: number;
  name: string;
  phone: string;
  role: string;
}

interface BlogPostDTO {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  tag: string;
  doctor: Doctor;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/blog");
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Không thể tải blog");
        }
        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        console.error("Lỗi khi tải blog:", err);
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Đang tải...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-center px-4">
        Lỗi: {error}
      </div>
    );

  return (
    <div className="pt-24 px-4 md:px-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Bài viết Blog</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">Chưa có bài viết nào.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 transition hover:shadow-md"
            >
              <Link href={`/blog/${post.id}`}>
                <h2 className="text-2xl font-semibold text-blue-700 hover:underline cursor-pointer">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleString("vi-VN")} —{" "}
                <span className="italic text-gray-600">Bác sĩ {post.doctor.name}</span>
              </p>
              <p className="mt-3 text-gray-700">
                {post.content ? post.content.slice(0, 150) + "..." : "Không có nội dung"}
              </p>
              <div className="mt-4">
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-block text-sm text-blue-600 hover:underline"
                >
                  Đọc thêm →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
