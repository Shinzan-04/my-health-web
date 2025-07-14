"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ApiService from "@/app/service/ApiService";
import toast, { Toaster } from "react-hot-toast";

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

const PAGE_SIZE = 6;

export default function BlogAdminFullPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<Omit<BlogPost, "id" | "createdAt">>({
    title: "",
    content: "",
    tag: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [page, setPage] = useState(1);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  const isPrivileged = userRole === "DOCTOR" || userRole === "ADMIN";

  useEffect(() => {
    const raw = localStorage.getItem("authData");
    if (!raw) return;
    try {
      const p = JSON.parse(raw);
      setUserRole(p?.account?.role || p?.role || "");
      setDoctorId(p?.doctor?.doctorId || p?.account?.doctor?.doctorId || null);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchBlogs = async () => {
  try {
    const data = await ApiService.getAllBlogs();

    const enriched = await Promise.all(
      data.map(async (b: BlogPost) => {
        if (!b.doctorId) {
          // Nếu không có doctorId → bài do Admin đăng
          return { ...b, doctorName: "Admin" };
        }

        if (!b.doctorName) {
          // Nếu thiếu tên bác sĩ → gọi API để lấy
          try {
            const d = await ApiService.getDoctorById(b.doctorId);
            return { ...b, doctorName: d.fullName };
          } catch {
            return { ...b, doctorName: "Không rõ" };
          }
        }

        return b; // Đã có doctorName → giữ nguyên
      })
    );

    setBlogs(
      enriched.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    setPage(1);
  } catch {
    toast.error("Lỗi tải blog");
  }
};

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const close = () => setDropdownOpen(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append(
        "blog",
        new Blob(
          [JSON.stringify(editingId ? { ...form, doctorId } : form)],
          { type: "application/json" }
        )
      );
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await ApiService.updateBlogWithImage(editingId, fd);
        toast.success("Đã cập nhật");
      } else {
        await ApiService.createBlogWithImage(fd);
        toast.success("Đã đăng");
      }
      resetForm();
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.response?.data || "Lỗi gửi blog");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", content: "", tag: "" });
    setImageFile(null);
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (b: BlogPost) => {
    setEditingId(b.id);
    setForm({
      title: b.title ?? "",
      content: b.content ?? "",
      tag: b.tag ?? "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xoá bài viết?")) return;
    try {
      await ApiService.deleteBlog(id);
      toast.success("Đã xoá!");
      setBlogs((p) => p.filter((b) => b.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data || "Xoá thất bại");
    }
  };

  const totalPages = Math.ceil(blogs.length / PAGE_SIZE);
  const pagedBlogs = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-700">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">📋 Quản lý Blog</h1>
        {isPrivileged && (
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setForm({ title: "", content: "", tag: "" });
              setImageFile(null);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-full shadow-lg transition"
          >
            Thêm Blog
          </button>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={resetForm}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Cập nhật" : "Thêm Blog"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="Tiêu đề"
                name="title"
                required
                value={form.title ?? ""}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Thẻ (tag)"
                name="tag"
                value={form.tag ?? ""}
                onChange={(e) =>
                  setForm({ ...form, tag: e.target.value })
                }
              />
              <textarea
                className="w-full border p-2 rounded h-40"
                placeholder="Nội dung"
                name="content"
                required
                value={form.content ?? ""}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block"
              />

              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                  onClick={resetForm}
                >
                  Huỷ
                </button>
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
                    ? "Cập nhật"
                    : "Đăng Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRID 3 CỘT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagedBlogs.map((b) => (
          <article
            key={b.id}
            className="relative bg-white rounded-2xl shadow-lg border overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300"
          >
            {b.imageUrl && (
              <img
                src={`http://localhost:8080${b.imageUrl}`}
                alt="thumbnail"
                className="w-full h-48 object-cover rounded-t-2xl"
              />
            )}
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                {b.title}
              </h2>
              <p className="text-xs text-gray-500 mb-2">
                {new Date(b.createdAt).toLocaleString("vi-VN")} • {b.tag} • 👨‍⚕️{" "}
                {b.doctorName || "Ẩn danh"}
              </p>
              <p className="text-sm text-gray-700 line-clamp-3 flex-1">
                {b.content}
              </p>
              <Link
                href={`/blog/${b.id}`}
                className="mt-4 inline-block self-start text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Xem thêm →
              </Link>
            </div>

            {isPrivileged && (
              <div
                className="absolute top-2 right-2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(dropdownOpen === b.id ? null : b.id);
                  }}
                  className="text-gray-500 hover:text-gray-700 px-2"
                >
                  ⋮
                </button>
                {dropdownOpen === b.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 shadow rounded text-sm"
                  >
                    <button
                      onClick={() => {
                        handleEdit(b);
                        setDropdownOpen(null);
                      }}
                      className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(b.id);
                        setDropdownOpen(null);
                      }}
                      className="block w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100"
                    >
                      Xoá
                    </button>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            « Trước
          </button>
          <span className="text-sm font-medium">
            Trang {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-300"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Sau »
          </button>
        </div>
      )}
    </div>
  );
}
