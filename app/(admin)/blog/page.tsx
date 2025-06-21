"use client";

import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  doctorId?: number;
  doctorName?: string;
};

export default function BlogAdminFullPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<Partial<BlogPost>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedBlogIds, setExpandedBlogIds] = useState<number[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");

  useEffect(() => {
    const authData = localStorage.getItem("authData");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const role = parsed?.account?.role || parsed?.role || "";
        const doctorId = parsed?.doctor?.doctorId || parsed?.account?.doctor?.doctorId;
        const name = parsed?.doctor?.fullName || parsed?.account?.doctor?.fullName;

        setUserRole(role);
        setForm((prev) => ({ ...prev, doctorId: doctorId || undefined }));
        if (name) setDoctorName(name);
      } catch (e) {
        console.error("Lỗi khi phân tích authData:", e);
      }
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await ApiService.getAllBlogs();
      const sorted = data.sort(
        (a: BlogPost, b: BlogPost) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBlogs(sorted);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await ApiService.updateBlog(editingId, form);
        alert("Cập nhật thành công!");
      } else {
        await ApiService.createBlog(form);
        alert("Thêm blog thành công!");
      }
      setForm({ title: "", content: "", tag: "" });
      setEditingId(null);
      setShowForm(false);
      fetchBlogs();
    } catch (err: any) {
      console.error("Lỗi submit:", err);
      alert("Không thể gửi blog: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      content: blog.content,
      tag: blog.tag,
      doctorId: blog.doctorId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn xoá bài viết này không?")) return;
    try {
      await ApiService.deleteBlog(id);
      alert("Xoá thành công");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      console.error("Lỗi xoá:", err);
      alert("Không thể xoá: " + (err.response?.data || err.message));
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedBlogIds((prev) =>
      prev.includes(id) ? prev.filter((blogId) => blogId !== id) : [...prev, id]
    );
  };

  return (
  <div className="p-6 max-w-6xl mx-auto text-gray-700">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-blue-800">📋 Quản lý Blog</h1>
      {userRole === "DOCTOR" && (
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setEditingId(null);
            setForm((prev) => ({ ...prev }));
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        >
          {showForm ? "Ẩn Form" : "➕ Thêm Blog"}
        </button>
      )}
    </div>

    {showForm && userRole === "DOCTOR" && (
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 bg-blue-50 p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Tiêu đề"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full border p-2 rounded text-gray-900"
        />
        <input
          type="text"
          placeholder="Thẻ (tag)"
          value={form.tag || ""}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className="w-full border p-2 rounded text-gray-900"
        />
        <textarea
          placeholder="Nội dung"
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          className="w-full border p-2 rounded h-40 text-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading
            ? "Đang xử lý..."
            : editingId
            ? "Cập nhật bài viết"
            : "Đăng Blog"}
        </button>
      </form>
    )}

    <div className="space-y-6">
      {blogs.map((blog) => {
        const isExpanded = expandedBlogIds.includes(blog.id);
        const displayContent =
          isExpanded || blog.content.length <= 300
            ? blog.content
            : blog.content.slice(0, 300) + "...";

        return (
          <article
            key={blog.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full"
          >
            <header className="mb-4 border-b pb-2 border-blue-100 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-blue-900">
                  {blog.title}
                </h2>
                <div className="flex items-center text-sm text-gray-600 gap-2 flex-wrap mt-1">
                  <span className="text-blue-700 font-medium">{blog.tag}</span>
                  <span className="text-gray-500">
                    {new Date(blog.createdAt).toLocaleString("vi-VN")}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <span className="mr-1">👨‍⚕️</span>
                    {blog.doctorName || "Bác sĩ ẩn danh"}
                  </span>
                </div>
              </div>

              {userRole === "DOCTOR" && (
                <div className="flex flex-col gap-2 items-end ml-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    🗑️ Xoá
                  </button>
                </div>
              )}
            </header>

            <p className="text-gray-700 text-base leading-relaxed mb-4 whitespace-pre-wrap">
              {displayContent}
            </p>

            {blog.content.length > 300 && (
              <button
                onClick={() => toggleExpanded(blog.id)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
              >
                {isExpanded ? "Ẩn bớt ↑" : "Đọc thêm →"}
              </button>
            )}
          </article>
        );
      })}
    </div>
  </div>
);

}
