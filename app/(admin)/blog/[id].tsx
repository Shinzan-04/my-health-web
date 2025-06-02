"use client";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";

export default function BlogDetail() {
  const { id } = useParams();
  const { data: post, mutate } = useSWR(`http://localhost:8080/api/blog/${id}`, fetcher);
  const { data: comments } = useSWR(`http://localhost:8080/api/blog/${id}/comments`, fetcher);

  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    await fetch(`http://localhost:8080/api/blog/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment })
    });
    setComment("");
    mutate();
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600">{post.createdAt}</p>
      <div className="my-4 text-gray-900">{post.content}</div>

      <div className="mt-6">
        <h2 className="font-semibold text-xl mb-2">Bình luận</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Gửi bình luận
        </button>

        <div className="mt-4 space-y-2">
          {comments?.map((c: any) => (
            <div key={c.id} className="p-2 border rounded bg-white">
              <p className="text-gray-800">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
