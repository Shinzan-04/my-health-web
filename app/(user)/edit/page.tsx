"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApiService from "@/app/service/ApiService";

export default function EditCustomerProfile() {
  const [customer, setCustomer] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
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

      ApiService.getMyCustomerProfile()
        .then((data) => {
          setCustomer(data);
          setCustomerId(data.customerID || data.customerId || data.id);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Không thể tải hồ sơ khách hàng.");
          router.push("/login");
        });
    } catch (err) {
      console.error("Lỗi khi đọc token:", err);
      router.push("/login");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (customer) {
      setCustomer({ ...customer, [e.target.name]: e.target.value });
    }
  };

  const validateCustomerForm = (customer: any) => {
    const errors: any = {};

    // Họ tên: bắt buộc, tối thiểu 2 ký tự
    if (!customer.fullName || customer.fullName.trim().length < 2) {
      errors.fullName = "Vui lòng nhập họ tên hợp lệ";
    }

    // Số điện thoại: bắt buộc, chỉ gồm 9-11 chữ số
    if (!customer.phone) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(customer.phone)) {
      errors.phone = "Số điện thoại không hợp lệ. Chỉ gồm 9-11 chữ số.";
    }

    // Địa chỉ: bắt buộc
    if (!customer.address || customer.address.trim().length < 2) {
      errors.address = "Vui lòng nhập địa chỉ";
    }

    // Ngày sinh: bắt buộc, phải đủ 16 tuổi trở lên
    const dob = customer.dob || customer.dateOfBirth;
    if (!dob) {
      errors.dob = "Vui lòng nhập ngày sinh";
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 16) {
        errors.dob = "Bạn phải đủ 16 tuổi trở lên";
      }
    }

    // Giới tính: bắt buộc
    if (!customer.gender) {
      errors.gender = "Vui lòng chọn giới tính";
    }

    // Email: không bắt buộc, nhưng nếu nhập thì phải đúng định dạng
    if (customer.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(customer.email)) {
      errors.email = "Email không hợp lệ";
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!customer || !customerId || !token) return;

    const validationErrors = validateCustomerForm(customer);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      alert("Vui lòng sửa các lỗi trong biểu mẫu trước khi tiếp tục.");
      return;
    }

    try {
      const formData = new FormData();
      const customerBlob = new Blob([JSON.stringify(customer)], {
        type: "application/json",
      });
      formData.append("customer", customerBlob);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await ApiService.updateCustomerProfile(customerId, formData, token);

      alert("Cập nhật thành công!");
      router.push("/edit");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật.");
    }
  };

  if (loading || !customer) return <div className="mt-32 text-center text-gray-700">Đang tải hồ sơ...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Chỉnh sửa hồ sơ cá nhân</h2>
        {customer.avatarUrl && (
          <div className="flex justify-center mb-6">
            <img
              src={`http://localhost:8080${customer.avatarUrl}`}
              alt="Avatar bác sĩ"
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/avatar-default.png";
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Họ tên:</label>
            <input
              name="fullName"
              value={customer.fullName ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Địa chỉ:</label>
            <input
              name="address"
              value={customer.address ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Số điện thoại:</label>
            <input
              name="phone"
              value={customer.phone ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>



          

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Ngày sinh:</label>
            <input
              name="dateOfBirth"
              type="date"
              value={customer.dateOfBirth ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Giới tính:</label>
            <select
              name="gender"
              value={customer.gender ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
          
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
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

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={customer.email ?? ""}
                readOnly
                disabled
                className="w-full border border-gray-400 px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-gray-500"
                placeholder="Email"
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