"use client";
import { useBookingStore } from "@/store/booking";
import QRCode from "react-qr-code";

export default function ThankYou() {
  const { room, checkIn, checkOut } = useBookingStore();

  if (!room) return <div>Không có dữ liệu</div>;

  return (
    <div className="max-w-xl mx-auto py-10 text-center space-y-6">
      <h2 className="text-2xl font-semibold text-green-600">
        Đặt phòng thành công 🎉
      </h2>

      <div>
        <div>{room.name}</div>
        <div>
          {checkIn} → {checkOut}
        </div>
      </div>

      {/* QR */}
      <div className="flex justify-center">
        <QRCode
          value={JSON.stringify({
            room: room.id,
            checkIn,
            checkOut,
          })}
        />
      </div>

      <div className="text-sm text-gray-500">
        Vui lòng đưa mã này khi check-in
      </div>
    </div>
  );
}