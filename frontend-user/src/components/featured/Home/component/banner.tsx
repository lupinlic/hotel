"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import DateField from "@/components/shared/components/DateField";
function Banner() {
  const banners = ["/image/banner1.jpg", "/image/banner2.jpg"];
  const [current, setCurrent] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [openGuest, setOpenGuest] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const snowflakes = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: (i / 40) * 100 + Math.random() * 2,
        size: 12 + Math.random() * 10,
        duration: 12 + Math.random() * 8,
      })),
    [],
  );

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  useEffect(() => {
    const id = setInterval(next, 10000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-full">
      <div className="relative  w-full h-[500px] overflow-hidden">
        {/* snowflakes */}
        {snowflakes.map((flake) => (
          <img
            key={flake.id}
            src="/image/sparkle1.png"
            className="snowflake z-20"
            style={{
              left: `${flake.left}% `,
              width: `90%`,
              animationDuration: `${flake.duration}s`,
            }}
          />
        ))}
        {banners.map((src, idx) => (
          <div
            key={src}
            className={`absolute top-0 left-4 right-4 h-full transition-opacity duration-500 z-10 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={src}
              alt={`banner-${idx}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* controls */}
        <button
          onClick={prev}
          className="absolute hover:bg-gray-300 left-5 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute hover:bg-gray-300 right-5 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
        {/* search room */}
        <div className="h-[128px] z-50 absolute bottom-0 left-4 right-4 bg-[#2196f3e6] flex items-center justify-center gap-6">
          <h1 className="text-white text-[1.6em]">
            TÌM KIẾM PHÒNG <br /> NHANH
          </h1>
          {/* Search Box */}
          <div className="flex  bg-gray-100 items-stretch">
            {/* Ngày đến */}
            <DateField
              label="Ngày đến"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(value) => {
                setCheckIn(value);
                if (checkOut && checkOut <= value) {
                  setCheckOut("");
                }
              }}
              className="border-r border-gray-300 bg-gray-100"
            />
            {/* Ngày đi */}
            <DateField
              label="Ngày đi"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={setCheckOut}
              className="border-r border-gray-300 bg-gray-100"
            >
            </DateField>

            {/* Khách */}
            <div className="relative px-6 py-4 border-r border-gray-300">
              <div className="text-[#989898] text-[14px] uppercase">
                Khách hàng
              </div>

              <div
                className="text-gray-700 text-sm mt-1 cursor-pointer"
                onClick={() => setOpenGuest(!openGuest)}
              >
                {adults} người lớn , {children} trẻ em
              </div>

              {openGuest && (
                <div className="absolute left-0 top-[-100px] mt-2 bg-white border border-gray-300 shadow-lg p-4 w-[220px] z-50">
                  {/* adults */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 text-[12px]">Người lớn</span>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="px-2 bg-gray-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-gray-700 text-[12px]">{adults}</span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="px-2 bg-gray-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* children */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-[12px]">Trẻ em</span>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="px-2 bg-gray-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-gray-700 text-[12px]">{children}</span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="px-2 bg-gray-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Button */}
            <div className="flex items-center px-4 bg-gray-100">
              <button className="bg-text-blue hover:bg-[#1f7bc0] text-white cursor-pointer px-6 py-3 rounded">
                SẴN SÀNG KIỂM TRA
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* main */}
    </div>
  );
}

export default Banner;
