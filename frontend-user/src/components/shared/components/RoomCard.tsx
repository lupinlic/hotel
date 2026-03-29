"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";

interface RoomCardProps {
  id: number;
  name: string;
  price?: number;
  image: string;
}

function RoomCard({ id, name, price = 0, image }: RoomCardProps) {
  return (
    <Link href={`/room_type/${id}`}>
      <div className="bg-white overflow-hidden hover:shadow-lg transition cursor-pointer">
        
        {/* IMAGE */}
        <div className="relative w-full h-[252px] group overflow-hidden">

          <img
            src={image}
            alt={name}
            className="object-cover group-hover:scale-105 transition duration-500"
          />

          {/* border animation */}
          <span className="absolute top-0 left-0 h-[3px] w-0 bg-yellow-400 group-hover:w-full transition-all duration-500"></span>
          <span className="absolute top-0 right-0 w-[3px] h-0 bg-yellow-400 group-hover:h-full transition-all duration-500 delay-150"></span>
          <span className="absolute bottom-0 right-0 h-[3px] w-0 bg-yellow-400 group-hover:w-full transition-all duration-500 delay-300"></span>
          <span className="absolute bottom-0 left-0 w-[3px] h-0 bg-yellow-400 group-hover:h-full transition-all duration-500 delay-450"></span>

        </div>

        {/* CONTENT */}
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {name}
          </h3>

          <p className="text-orange-500 text-xl font-bold mt-2">
            Giá từ {Number(price).toLocaleString()} đ/đêm
          </p>
        </div>

      </div>
    </Link>
  );
}

export default RoomCard;