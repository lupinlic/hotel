"use client";
import { useBookingStore } from "@/store/booking";
import BookingSummary from "./components/BookingSummary";
import RoomList from "./components/RoomList";

function Reservation() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* LEFT */}
        <div className="col-span-2">
          <RoomList />
        </div>

        {/* RIGHT */}
        <div>
          <BookingSummary />
        </div>
      </div>
    </div>
  );
}

export default Reservation;
