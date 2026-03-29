"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  id: number;
  title: string;
  description: string;
  image: string;
  day: string;
  month: string;
}

export default function NewsCard({
  id,
  title,
  description,
  image,
  day,
  month,
}: Props) {
  return (
    <Link href={`/news/${id}`}>
      <div className="group cursor-pointer">

        {/* IMAGE */}
        <div className="relative h-[234px] w-[360px] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />

          {/* date */}
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-center px-3 py-2">
            <div className="font-bold text-lg">{day}</div>
            <div className="text-sm">{month}</div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition">
            {title}
          </h3>

          <div className="w-10 h-[2px] bg-gray-300 my-2"></div>

          <p className="text-gray-600 text-sm">
            {description}
          </p>
        </div>

      </div>
    </Link>
  );
}