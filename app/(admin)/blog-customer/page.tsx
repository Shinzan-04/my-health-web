"use client";

import { useEffect, useState } from "react";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  doctor?: { name: string };
};

export default function BlogCustomerPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBlogIds, setExpandedBlogIds] = useState<number[]>([]); // ID các bài viết đang bung nội dung

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/blogposts");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: BlogPost[] = await res.json();

        // ✅ Sắp xếp theo thời gian mới nhất trước
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setBlogs(sortedData);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedBlogIds((prev) =>
      prev.includes(id) ? prev.filter((blogId) => blogId !== id) : [...prev, id]
    );
  };

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-12 animate-fade-in-down">
          Blog Sức Khỏe
        </h1>

        {loading ? (
          <p className="text-center text-xl text-gray-600">Đang tải dữ liệu...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-xl text-gray-500">Không có bài viết nào.</p>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {blogs.map((blog) => {
              const isExpanded = expandedBlogIds.includes(blog.id);
              const displayContent = isExpanded
                ? blog.content
                : blog.content.length > 300
                ? blog.content.slice(0, 300) + "..."
                : blog.content;

              return (
                <article
                  key={blog.id}
                   className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full"
                   >
                  <header className="mb-4 border-b pb-2 border-blue-100">
                    <h2 className="text-xl font-semibold text-blue-900 mb-2">
                      {blog.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600 gap-2 flex-wrap">
                      <span className="text-blue-700">{blog.tag}</span>
                      <span className="text-gray-500">
                        {new Date(blog.createdAt).toLocaleString("vi-VN")}
                      </span>
                      <span className="flex items-center text-gray-500">
                        <span className="mr-1">👨‍⚕️</span>
                        {blog.doctor?.name ?? "Bác sĩ ẩn danh"}
                      </span>
                    </div>
                  </header>

                  <p className="text-gray-700 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                    {displayContent}
                  </p>

                  {blog.content.length > 300 && (
                    <button
                      onClick={() => toggleExpanded(blog.id)}
                      className="self-end text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                    >
                      {isExpanded ? "Ẩn bớt ↑" : "Đọc thêm →"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
