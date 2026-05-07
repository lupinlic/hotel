"use client";

import Image from "next/image";

export default function ZaloButton() {
  const phone = "84328443736";

  const handleClick = () => {
    window.open(`https://zalo.me/${phone}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center">
      {/* vòng tròn lan */}
      <span className="absolute w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-50"></span>

      {/* nút chính */}
      <div
        onClick={handleClick}
        className="relative flex items-center cursor-pointer "
      >
        {/* icon tròn */}
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Image
            src="/image/zalo-icon.png"
            alt="zalo"
            width={32}
            height={32}
            className="animate-shake"
          />
        </div>
      </div>
    </div>
  );
}