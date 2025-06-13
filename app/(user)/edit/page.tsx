"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApiService from "@/app/service/ApiService";

export default function EditUserProfile() {
  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("authData");
    if (!raw) {
      alert("Vui lòng đăng nhập lại.");
      router.push("/login");
      return;
    }
    try {
      const authData = JSON.parse(raw);
      const token = authData.token;
      if (!token) throw new Error("Token không hợp lệ.");
      setToken(token);
      fetch("http://localhost:8080/api/customers/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Không thể tải hồ sơ người dùng.");
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setUserId(data.customerID); // Sửa đúng tên trường ID
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Không thể tải hồ sơ người dùng.");
          router.push("/login");
        });
    } catch (err) {
      console.error("Lỗi khi đọc token:", err);
      router.push("/login");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (user) {
      const { name, value } = e.target;
      if (name === "name") {
        setUser({ ...user, fullName: value });
      } else {
        setUser({ ...user, [name]: value });
      }
    }
  };

  function validateForm(user: any) {
    const newErrors: any = {};
    if (!user.fullName || user.fullName.trim().length < 2) {
      newErrors.name = "Vui lòng nhập họ tên hợp lệ";
    }
    if (!user.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!user.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(user.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ. Chỉ gồm 9-11 chữ số.";
    }
    if (!user.dob) {
      newErrors.dob = "Vui lòng nhập ngày sinh";
    }
    return newErrors;
  }

  const handleSubmit = async () => {
    console.log("submit clicked");
    setSuccessMsg("");
    setErrors({});

    if (!user || !userId || !token) {
      console.warn("Thiếu user, userId hoặc token");
      return;
    }

    const validationErrors = validateForm(user);
    console.log("Validation errors:", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const customerData = {
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  address: user.address,
  dateOfBirth: user.dob, // đổi từ dob thành dateOfBirth đúng với backend
  gender: user.gender,
};

      const formData = new FormData();
      const customerBlob = new Blob([JSON.stringify(customerData)], {
        type: "application/json",
      });
      formData.append("customer", customerBlob);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      console.log("Sending update request...");
      const res = await fetch(`http://localhost:8080/api/customers/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      console.log("Response status:", res.status);
      if (!res.ok) {
  const errMsg = await res.text();
  console.error("Lỗi từ backend:", errMsg); // Ghi log lỗi
  setErrors({ submit: errMsg || "Lỗi khi cập nhật hồ sơ." });
  return;
}

      setSuccessMsg("Cập nhật thành công! Dữ liệu đã được lưu vào hệ thống.");
      setTimeout(() => {
        router.push("/edit");
      }, 1200);
    } catch (err) {
      console.error("Lỗi khi gửi request:", err);
      setErrors({ submit: "Lỗi khi cập nhật." });
    }
  };

  if (loading || !user)
    return <div className="mt-32 text-center text-gray-700">Đang tải hồ sơ...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Chỉnh sửa hồ sơ cá nhân
        </h2>
        {successMsg && (
          <div className="mb-4 text-green-600 text-center font-medium">
            {successMsg}
          </div>
        )}
        {errors.submit && (
          <div className="text-red-500 text-center font-medium mb-2">{errors.submit}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Họ và tên:
            </label>
            <input
              name="name"
              value={user.fullName ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Số điện thoại:
            </label>
            <input
              name="phone"
              value={user.phone ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Địa chỉ:
            </label>
            <input
              name="address"
              value={user.address ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Ngày sinh:
            </label>
            <input
              name="dob"
              type="date"
              value={user.dob ?? user.dateOfBirth ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dob && (
              <div className="text-red-500 text-sm mt-1">{errors.dob}</div>
            )}
         
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Giới tính:
            </label>
            <select
              name="gender"
              value={user.gender ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Tải ảnh đại diện:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatarFile(file);
              }}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
