"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/components/header/ProfileMenu";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [mounted, setMounted] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [email, setEmail] = useState<string>("");


const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

const homeLabel =
  userRole === "ADMIN"
    ? "Trang Quản Trị"
    : userRole === "DOCTOR"
    ? "Trang Bác Sĩ"
    : userRole === "USER"
    ?  "Trang Người Dùng" : "";

const homeHref =
  userRole === "ADMIN"
    ? "/admin"
    : userRole === "DOCTOR"
    ? "/doctorPanel"
    : "/userPanel";

const navLinks = [
  { label: "Trang Chủ", href: "/" },
  { label: "Bác Sĩ", href: "/list-doctor" },
  { label: "Liên Hệ", href: "/contact" },
  { label: "Blog", href: "/blog" },
  ...(userRole === "USER" || !isLoggedIn
    ? [{ label: "Đặt lịch", href: "/registrations" }]
    : []),
  { label: homeLabel, href: homeHref },
];


  const userMenuItems = [
    { label: "Chỉnh sửa hồ sơ", href: "/edit" },
    { label: "Kết quả xét nghiệm", href: "/admin/testresults" },
    { label: "Lịch sử khám bệnh", href: "/medical-history" },
    { label: "ARV", href: "/arv" },
    { label: "Nhắc nhở", href: "/userPanel" },
  ];

  const adminMenuItems = [
    { label: "Lịch sử khám/tư vấn", href: "/admin/list-registration" },
    { label: "Nhập kết quả xét nghiệm", href: "/admin/testresults" },
  ];

  const doctorMenuItems = [
    { label: "Chỉnh sửa hồ sơ", href: "/edit-profile" },
    { label: "Bệnh nhân điều trị", href: "/admin/list-registration" },
    { label: "Hồ sơ bệnh nhân", href: "/profilecustomer" },
    { label: "Phác đồ điều trị", href: "/admin/arv" },
    { label: "Lịch làm việc", href: "/schedule" },
  ];

useEffect(() => {
  const authData = JSON.parse(localStorage.getItem("authData") || "{}");
  const token = authData.token;

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserRole(payload.role || "");
    setIsLoggedIn(true);

    const headers = { Authorization: `Bearer ${token}` };

    if (payload.role === "DOCTOR") {
      fetch("http://localhost:8080/api/doctors/me", { headers })
        .then((res) => res.json())
        .then((data) => {
          if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
          if (data.email) setEmail(data.email);
        })
        .catch(console.error);
    }

    if (payload.role === "USER") {
      fetch("http://localhost:8080/api/customers/me", { headers })
        .then((res) => res.json())
        .then((data) => {
          if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
          if (data.email) setEmail(data.email);
        })
        .catch(console.error);
    }
  }

  setMounted(true);
}, []);


  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem("authData");
    router.push("/login");
  };

  const handleProfileMenuLinkClick = (href: string) => {
    router.push(href);
    setShowProfileMenu(false);
  };

  const getProfileMenuItems = () => {
    switch (userRole) {
      case "USER":
        return userMenuItems;
      case "DOCTOR":
        return doctorMenuItems;
      default:
        return [];
    }
  };

  const renderDefaultHeader = () => (
    <div className="hidden md:flex items-center space-x-8">
      <nav className="flex space-x-8">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-[#27509f] text-base font-medium no-underline hover:underline"
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => router.push("/registrations")}
        className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Đăng Ký Khám
      </button>
      <button
        onClick={() => router.push("/login")}
        className="px-4 py-1.5 bg-sky-300 text-white rounded hover:bg-sky-400 transition"
      >
        Đăng nhập
      </button>
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
      <div className="px-4 py-1 md:px-8 md:py-1 flex justify-between items-center">


        <Link href="/" className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
          <h1 className="text-lg text-[#879FC5EB] m-0 font-semibold">
            HIV Treatment and Medical
          </h1>
        </Link>

        {isLoggedIn ? (
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[#27509f] text-base font-medium hover:underline"
                >
                  {label}
                </Link>
              ))}
            </nav>

<div className="relative flex items-center space-x-3 ml-25">
  <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="w-14 h-14 rounded-full overflow-hidden border hover:ring-2 hover:ring-blue-400 transition"
  >
    <img
      src={
        avatarUrl
          ? `http://localhost:8080${avatarUrl}`
          : "/avatar-default.png"
      }
      alt="Avatar"
      className="w-full h-full object-cover"
    />
  </button>

  {/* Hiển thị email */}
  {email && (
    <span className="text-sm text-medium text-gray-700">{email}</span>
  )}

  {/* Menu dropdown */}
{showProfileMenu && (
  <div className="absolute right-0 top-full mt-2 z-50">
    <ProfileMenu
      items={getProfileMenuItems()}
      onClose={() => setShowProfileMenu(false)}
      onLogout={handleLogout}
    />
  </div>
)}

</div>

          </div>
        ) : (
          renderDefaultHeader()
        )}

        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
