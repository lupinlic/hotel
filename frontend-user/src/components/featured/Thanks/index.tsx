"use client";

import Link from "next/link";


export default function ThankYou() {
  return (
    <div className="max-w-xl mx-auto py-10 text-center space-y-6">
      <h2 className="text-2xl font-semibold text-green-600">
        Đặt phòng thành công 🎉
      </h2>

      <p className="text-gray-600">
        Cảm ơn bạn đã đặt phòng ở khách sạn của chúng tôi. Mọi thông tin về phòng vui lòng theo dõi trong mail.
      </p>
      <div>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}

