import RoomCard from "./RoomCard";
import { rooms } from "@/data/rooms";

const RoomList = () => {
  return (
    <div>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default RoomList;