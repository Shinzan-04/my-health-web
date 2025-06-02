"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
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

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-600">Lỗi: {error}</div>;

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      {posts.map((post) => (
        <div key={post.postID} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            <Link href={`/blog/${post.postID}`}>{post.title}</Link>
          </h2>
          <p className="text-sm text-gray-500">{post.createdAt}</p>
          <p>{post.content.slice(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}
