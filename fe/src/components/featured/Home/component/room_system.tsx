import React from "react";
import RoomCard from "@/components/shared/components/RoomCard";
import { rooms } from "@/data/rooms";

function RoomSystem() {
  return (
    <div className="container mx-auto py-10">
      <h4 className="text-3xl font-bold text-center mb-8">
        Hệ thống phòng
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            id={room.id}
            name={room.name}
            price={room.price}
            image={room.image}
          />
        ))}
      </div>
    </div>
  );
}

export default RoomSystem;