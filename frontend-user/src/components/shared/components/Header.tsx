"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import AuthModal from "@/components/featured/AuthModal";
import { useGetUser, useLogout } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { data: user } = useGetUser();

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Đăng xuất thành công");
        window.location.reload();
      },
      onError: () => {
        toast.error("Đăng xuất thất bại");
      },
    });
  };

  const handleSearch = () => {
    const query = searchText.trim();
    if (query) {
      router.push(`/room?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/room');
    }
    setOpenSearch(false);
  };

  const menu = [
    { name: "TRANG CHỦ", href: "/" },
    { name: "GIỚI THIỆU", href: "/introduce" },
    { name: "HỆ THỐNG PHÒNG", href: "/room" },
    { name: "TIN TỨC", href: "/news" },
    { name: "LIÊN HỆ", href: "/contact" },
  ];

  return (
    <header className="w-full shadow-sm rounded-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 ">
        {/* Logo */}
        <Link href="/">
          <img src="/image/logo2.png" alt="logo" className="w-[100px] h-[50px]" />
        </Link>

        {/* Menu */}
        <nav className="flex items-center gap-8 text-sm font-semibold">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`transition ${
                  active
                    ? "text-primary"
                    : "text-text-secondary hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Search */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setOpenSearch(true)}
            onMouseLeave={() => setOpenSearch(false)}
          >
            <button className="text-gray-500 hover:text-black p-3">
              <Search size={20} />
            </button>

            <div
              className={`absolute right-0 top-full mt-0 z-99999 w-[320px] bg-white border border-gray-200 shadow-md p-4 transition-all duration-200 pointer-events-auto ${
                openSearch
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
              <div className="flex">
                <input
                type="text"
                placeholder="Tìm kiếm phòng..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-300 outline-none text-gray-600"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-orange-500 px-4 flex items-center justify-center text-white hover:bg-orange-600 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="M21 21l-4.3-4.3" strokeWidth="2" />
                </svg>
              </button>
              </div>
            </div>
          </div>

          {/* user profile dropdown */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setOpenUser(true)}
            onMouseLeave={() => setOpenUser(false)}
          >
            <button className="text-gray-500 hover:text-black p-3">
              <User size={20} />
            </button>

            <div
              className={`absolute right-0 top-full mt-0 w-[200px] z-99999 bg-white border border-gray-200 shadow-md p-4 transition-all duration-200 pointer-events-auto ${
                openUser
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
              <div className="flex flex-col gap-2">
                {!user ? (
                  <button
                    onClick={() => setOpen(true)}
                    className="px-3 py-2 text-center text-primary text-sm rounded hover:text-gray-700 hover:bg-gray-100 transition"
                  >
                    Đăng nhập
                  </button>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      className="px-3 py-2 text-center text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Thông tin cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-center text-red-600 hover:bg-gray-100 rounded"
                    >
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Auth modal */}
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </header>
  );
}
