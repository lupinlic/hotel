"use client";
import BookingBox from "./components/BookingBox";
import { Check } from "lucide-react";
import { useRoomType } from "@/hooks/useRoomTypes";
import { Room } from "@/types/room";
import ReviewSection from "./components/ReviewSection";

function RoomDetails({ id }: { id: string }) {
  const roomTypeId = Number(id);
  const { data: roomType, isLoading, isError } = useRoomType(roomTypeId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-10 text-red-500">Lỗi khi tải dữ liệu phòng</div>;
  }

  if (!roomType) {
    return <div className="p-10 text-red-500">Không tìm thấy phòng</div>;
  }

  const room: Room = {
    id: roomType.id,
    name: roomType.name,
    price: roomType.price,
    image: roomType.image_url ?? `/image/room/room${roomType.id}.jpg`,
    description: roomType.description ?? "",
    view: "Cảnh quan đẹp",
    size: 30,
    bed_type: roomType.bed_type ?? "",
    maxAdults: roomType.adult_capacity,
    maxChildren: roomType.child_capacity,
    amenities: roomType.amenities?.map((item) => item.name) ?? [],
  };

  return (
    <div>
      {/* 🔥 Banner */}
      <div className="relative w-full h-[500px]">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* title */}
        <div className="absolute bottom-10  text-white left-1/2 transform -translate-x-1/2 z-10">
          <h1 className="text-5xl font-bold">{room.name}</h1>
        </div>
      </div>

      {/* 🔽 Content */}
      <div className="flex max-w-6xl mx-auto p-6 space-y-8 ">
        <div className="w-2/3 flex flex-col gap-6">
          {/* Info nhanh */}
          <div className="flex flex-wrap gap-6 text-gray-700 text-sm border-b border-border py-4">
            <div>🏙 {room.view}</div>
            <div>📐 {room.size} m²</div>
            <div>🛏 {room.bed_type}</div>
            <div>👤 {room.maxAdults + room.maxChildren} khách</div>
          </div>

          {/* Mô tả */}
          <div className="space-y-4 border-b border-border py-4">
            <h2 className="text-2xl font-semibold mb-2">Giới thiệu</h2>
            <p className="text-gray-600 leading-relaxed">{room.description}</p>
          </div>

          {/* Tiện nghi */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">Tiện nghi</h2>

            <div className="flex flex-col gap-3">
              {room.amenities.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <Check size={18} className="text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bộ sưu tập */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">Bộ sưu tập</h2>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <img
                  src="/image/collection/drink-3.jpg"
                  alt="drink-3"
                  className="w-full h-50 object-cover"
                />
                <img
                  src="/image/collection/demo-59.jpg"
                  alt="demo-59"
                  className="w-full h-50 object-cover"
                />
              </div>
              <div className="flex gap-2">
                <img
                  src="/image/collection/about.jpg"
                  alt="about"
                  className="w-[250px] h-[400px] object-cover"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <img
                      src="/image/collection/listicon.jpg"
                      alt="demo-60"
                      className="w-full h-48 object-cover"
                    />
                     <img
                      src="/image/collection/151.jpg"
                      alt="demo-61"
                      className="w-full h-48 object-cover"
                    />

                  </div>
                  <img
                    src="/image/collection/hotel.jpg"
                    alt="demo-61"
                    className="w-full h-50 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <BookingBox price={room.price} id={room.id} room={room} />
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection roomId={room.id} />
    </div>
  );
}

export default RoomDetails;
