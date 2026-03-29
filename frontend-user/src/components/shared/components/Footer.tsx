import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className=" mx-auto px-6 py-12 max-w-6xl">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ABOUT */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Khách sạn Đà Lạt
            </h3>
            <p className="text-sm leading-relaxed">
              Chúng tôi mang đến trải nghiệm nghỉ dưỡng tuyệt vời với
              dịch vụ chuyên nghiệp và không gian sang trọng giữa lòng
              thành phố Đà Lạt.
            </p>
          </div>

          {/* MENU */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-400">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-orange-400">
                  Phòng
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-orange-400">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Liên hệ
            </h3>
            <ul className="space-y-2 text-sm">
              <li>📍 123 Đường ABC, Đà Lạt</li>
              <li>📞 0123 456 789</li>
              <li>✉️ contact@hotel.com</li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Kết nối
            </h3>

            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-orange-500 transition"
              >
                <Facebook size={18} color="white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-orange-500 transition"
              >
                <Linkedin size={18} color="white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-orange-500 transition"
              >
                <Instagram size={18} color="white" />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
          © {new Date().getFullYear()} Khách sạn Đà Lạt. All rights reserved.
        </div>

      </div>
    </footer>
  );
}