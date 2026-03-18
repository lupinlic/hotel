"use client";
import { useBookingStore } from "@/store/booking";
import toast from "react-hot-toast";

const RoomCard = ({ room }: any) => {
  const setBooking = useBookingStore((s) => s.setBooking);
  const { adults, children } = useBookingStore();

  return (
    <div className="border border-border shadow mb-6 bg-white">
      {/* Header */}
      <div className=" px-4 py-2">
        <h2 className="text-blue-500 font-semibold text-lg">{room.name}</h2>
      </div>

      {/* Body */}
      <div className="flex p-4 gap-4">
        {/* LEFT - IMAGE + INFO */}
        <div className="w-[220px]">
          <img
            src={room.image}
            className="w-full h-[140px] object-cover mb-3"
          />

          <div className="text-sm text-gray-600 space-y-1">
            <div>🏙 {room.view}</div>
            <div>📐 {room.size} m²</div>
            <div>🛏 {room.bed}</div>
          </div>
        </div>

        {/* RIGHT - TABLE INFO */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          {/* Thông tin khác */}
          <div>
            <div className="font-semibold mb-2 text-gray-700">
              Thông tin khác
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-medium">Gồm có</div>
              <div>✓ Ăn sáng</div>
              <div>✓ Đưa đón sân bay</div>

              <div className="mt-2 font-medium">Chính sách</div>
              <div>✓ Không hoàn lại 30% tiền phòng</div>
            </div>
          </div>

          {/* Sức chứa */}
          <div>
            <div className="font-semibold mb-2 text-gray-700">Sức chứa</div>

            <div className="text-sm text-gray-600 space-y-2">
              <div>👤 {room.maxAdults} người lớn</div>
              <div>👶 {room.maxChildren} trẻ em</div>
            </div>
          </div>

          {/* Giá + Button */}
          <div className="flex flex-col justify-between items-end">
            <div>
              <div className="text-xl text-orange-500 font-semibold">
                {room.price.toLocaleString("vi-VN")} đ
              </div>
              <div className="text-sm italic text-gray-500">
                Chi phí cho 1 đêm
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Chỉ còn lại 2 phòng
              </div>
            </div>

            <button
              onClick={() => {
                setBooking({
                  room: room,
                  adults: Math.min(adults, room.maxAdults),
                  children: Math.min(children, room.maxChildren),
                });
              }}
              className="mt-3 border text-gray-600 border-border px-4 py-2 hover:bg-blue-400 cursor-pointer hover:text-white transition"
            >
              ĐẶT NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
