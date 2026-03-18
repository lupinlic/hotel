// components/RoomCard.tsx
'use client'
import Link from "next/link";

type Room = {
  id: number;
  name: string;
  price: number;
  image: string;
  view: string;
  size: number;
  bed: string;
  maxAdults: number;
  maxChildren: number;
};

export default function RoomCard({ room }: { room: Room }) {
  return (
    <Link href={`/room_type/${room.id}`}>
      <div className="flex border border-gray-300 hover:shadow-md transition cursor-pointer bg-white">

        {/* Image */}
        <div className="w-[495px] h-[330px]">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <div>
            <h2 className="text-blue-500 text-2xl font-semibold">
              {room.name}
            </h2>

            <div className="mt-2 text-lg">
              Giá từ{" "}
              <span className="text-2xl font-bold">
                {room.price.toLocaleString("vi-VN")} đ
              </span>
              <span className="text-sm">/đêm</span>
            </div>

            <div className="mt-4 text-gray-700 text-[14px] space-y-2">
              <div>🏙 {room.view}</div>
              <div>📐 {room.size} m²</div>
              <div>🛏 {room.bed}</div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>👤 {room.maxAdults + room.maxChildren} x</div>

            <button className="border border-border px-4 py-2 hover:bg-blue-500 hover:text-white transition cursor-pointer">
              XEM THÊM THÔNG TIN
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}