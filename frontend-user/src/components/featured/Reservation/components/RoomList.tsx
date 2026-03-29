"use client";

import RoomCard from "./RoomCard";
import { useRoomTypes, RoomType } from "@/hooks/useRoomTypes";
import { Room } from "@/types/room";

const toRoom = (roomType: RoomType): Room => ({
  id: roomType.id,
  name: roomType.name,
  price: Number(roomType.price),
  image: roomType.image_url ?? `/image/room/room${roomType.id}.jpg`,
  description: roomType.description ?? "",
  view: "Cảnh quan đẹp",
  size: 30,
  bed_type: roomType.bed_type ? `${roomType.bed_type} x${roomType.bed_count ?? 1}` : "1 Giường đôi",
  maxAdults: roomType.adult_capacity,
  maxChildren: roomType.child_capacity,
  amenities: roomType.amenities?.map((item) => item.name) ?? [],
});

const RoomList = () => {
  const { data, isLoading, isError, error } = useRoomTypes();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Đang tải danh sách phòng...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Lỗi khi tải dữ liệu phòng: {error?.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="p-8 text-center">Chưa có phòng nào.</div>;
  }

  return (
    <div>
      {data.map((roomType) => (
        <RoomCard key={roomType.id} room={toRoom(roomType)} />
      ))}
    </div>
  );
};

export default RoomList;