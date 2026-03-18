"use client";
import { useState, useRef } from "react";
import DateField from "@/components/shared/components/DateField";
import { useBookingStore } from "@/store/booking";
import { useRouter } from "next/navigation";
import { Room } from "@/types/room";

interface BookingBoxProps {
  price: number;
  id: number;
  room: Room;
}

const BookingBox = ({ price, id, room }: BookingBoxProps) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [openGuest, setOpenGuest] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const setBooking = useBookingStore((s) => s.setBooking);
  const router = useRouter();

  const checkInRef = useRef<HTMLInputElement | null>(null);
  const checkOutRef = useRef<HTMLInputElement | null>(null);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className=" p-6 space-y-6 ">
      {/* Giá */}
      <div className=" text-center py-4 text-orange-500 text-xl font-semibold">
        Giá từ {price.toLocaleString("vi-VN")} đ/đêm
      </div>

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
        className="border border-gray-300 "
      />

      {/* Ngày đi */}
      <DateField
        label="Ngày đi"
        value={checkOut}
        min={checkIn || new Date().toISOString().split("T")[0]}
        onChange={setCheckOut}
        className="border border-gray-300 "
      ></DateField>
      {/* Khách */}
      <div className="relative px-6 py-4 border border-gray-300">
        <div className="text-[#989898] text-[14px] uppercase">Khách hàng</div>

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
      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 font-semibold cursor-pointer"
        onClick={() => {
          setBooking({
            id,
            room,
            checkIn,
            checkOut,
            adults,
            children,
          });

          router.push("/reservation");
        }}
      >
        Đặt ngay
      </button>
    </div>
  );
};

export default BookingBox;
