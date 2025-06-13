"use client";

import { useState } from "react";

export default function CreateBlogPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tag: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Lấy JWT

    try {
      const res = await fetch("http://localhost:8080/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi kèm token
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Đăng blog thành công!");
        setForm({ title: "", content: "", tag: "" });
      } else {
        alert("Lỗi: Bạn không có quyền hoặc dữ liệu sai!");
      }
    } catch (err) {
      console.error("Lỗi khi đăng blog:", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng bài Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Tiêu đề"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Thẻ (tag)"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Nội dung"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-2 rounded h-32"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Đăng blog
        </button>
      </form>
    </div>
  );
}
