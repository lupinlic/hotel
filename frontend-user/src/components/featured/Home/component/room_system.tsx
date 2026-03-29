import React from "react";
import RoomCard from "@/components/shared/components/RoomCard";
import { useRoomTypes } from "@/hooks/useRoomTypes";

function RoomSystem() {
  const { data: roomTypes, isLoading, isError } = useRoomTypes();
  console.log("Room types data:", roomTypes);

  return (
    <div className="container mx-auto py-10">
      <h4 className="text-3xl font-bold text-center mb-8">Hệ thống phòng</h4>

      {isLoading && (
        <p className="text-center text-gray-500">Đang tải phòng...</p>
      )}

      {isError && (
        <p className="text-center text-red-500">Không tải được danh sách phòng.</p>
      )}

      {!isLoading && !isError && (roomTypes?.length ?? 0) === 0 && (
        <p className="text-center text-gray-500">Chưa có phòng nào.</p>
      )}

      {!isLoading && !isError && (roomTypes?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomTypes?.map((roomType) => (
            <RoomCard
              key={roomType.id}
              id={roomType.id}
              name={roomType.name || `Phòng ${roomType.id}`}
              price={roomType.price}
              image={roomType.image_url || "/image/default-room.jpg"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomSystem;