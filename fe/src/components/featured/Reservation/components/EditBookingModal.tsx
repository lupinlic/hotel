"use client";
import { useBookingStore } from "@/store/booking";
import { useRef } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EditBookingModal = ({ open, onClose }: Props) => {
  const { room, checkIn, checkOut, adults, children, setBooking } =
    useBookingStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];
  const getNextDay = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* box */}
      <div
        className="bg-white w-[400px] p-6 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()} // 👈 chặn click ra ngoài
      >
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa đặt phòng</h2>

        {/* DATE */}
        <div className="space-y-3">
          <div
            onClick={() => inputRef.current?.showPicker()}
            className="cursor-pointer border border-border rounded-lg p-3 hover:border-blue-400"
          >
            <div className="text-sm text-gray-500">Ngày đến</div>
            <div className="font-medium">{checkIn || "Chọn ngày"}</div>

            <input
              ref={inputRef}
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setBooking({ checkIn: e.target.value })}
              className="opacity-0 absolute pointer-events-none"
            />
          </div>

          <div
            onClick={() => outRef.current?.showPicker()}
            className="cursor-pointer border border-border rounded-lg p-3 hover:border-blue-400"
          >
            <div className="text-sm text-gray-500">Ngày đi</div>
            <div className="font-medium">{checkOut || "Chọn ngày"}</div>

            <input
              ref={outRef}
              type="date"
              min={checkIn ? getNextDay(checkIn) : today}
              value={checkOut}
              onChange={(e) => setBooking({ checkOut: e.target.value })}
              className="opacity-0 absolute pointer-events-none"
            />
          </div>
        </div>

        {/* GUEST */}
        <div className="mt-4 space-y-3">
          {/* adults */}
          <div className="flex justify-between items-center">
            <span>Người lớn</span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() =>
                  setBooking({
                    adults: Math.max(1, adults - 1),
                  })
                }
                className="px-2 bg-gray-200"
              >
                -
              </button>
              <span>{adults}</span>
              <button
                onClick={() => {
                  if (adults >= (room?.maxAdults || 0)) {
                    toast.error(`Tối đa ${room.maxAdults} người lớn`);
                    return;
                  }

                  setBooking({ adults: adults + 1 });
                }}
                className="px-2 bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* children */}
          <div className="flex justify-between items-center">
            <span>Trẻ em</span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() =>
                  setBooking({
                    children: Math.max(0, children - 1),
                  })
                }
                className="px-2 bg-gray-200"
              >
                -
              </button>
              <span>{children}</span>
              <button
                onClick={() => {
                  if (children >= (room?.maxChildren || 0)) {
                    toast.error(`Tối đa ${room.maxChildren} trẻ em`);
                    return;
                  }

                  setBooking({ children: children + 1 });
                }}
                className="px-2 bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border hover:bg-gray-100 cursor-pointer"
          >
            Hủy
          </button>

          <button
            onClick={() => {
              if (!checkIn || !checkOut) {
                toast.error("Vui lòng chọn ngày");
                return;
              }

              if (new Date(checkOut) <= new Date(checkIn)) {
                toast.error("Ngày đi phải sau ngày đến");
                return;
              }

              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
