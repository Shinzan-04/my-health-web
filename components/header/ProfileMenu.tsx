"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

interface MenuItem {
  label: string;
  href: string;
}

interface ProfileMenuProps {
  items: MenuItem[];
  onClose: () => void;
  onLogout: () => void;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ items, onClose, onLogout }) => {
  const router = useRouter();

  const handleClick = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg z-50 p-2"
      onClick={handleContainerClick}
    >
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <button
              onClick={() => handleClick(item.href)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <hr className="my-2" />
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default ProfileMenu;
