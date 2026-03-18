"use client";
import { useBookingStore } from "@/store/booking";
import { useState } from "react";
import EditBookingModal from "./EditBookingModal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formatDate = (dateStr: string) => {
  if (!dateStr) return null;

  const date = new Date(dateStr);

  const day = date.getDate();
  const weekday = date.toLocaleDateString("vi-VN", {
    weekday: "long",
  });
  const monthYear = date.toLocaleDateString("vi-VN", {
    month: "short",
    year: "numeric",
  });

  return { day, weekday, monthYear };
};

const BookingSummary = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const { room, checkIn, checkOut, adults, children, clearBooking } =
    useBookingStore();
  const isValid =
    room && checkIn && checkOut && new Date(checkOut) > new Date(checkIn);
  const router = useRouter();
  if (!room) {
    return (
      <div className="border border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50">
        {/* icon */}
        <div className="text-4xl mb-3">🏨</div>

        {/* title */}
        <div className="font-semibold text-gray-700">Chưa chọn phòng</div>

        {/* description */}
        <div className="text-sm text-gray-500 mt-1">
          Vui lòng chọn phòng để tiếp tục đặt
        </div>

        {/* button */}
      </div>
    );
  }

  const inDate = formatDate(checkIn);
  const outDate = formatDate(checkOut);

  const nights =
    checkIn && checkOut
      ? (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
      : 1;

  const total = nights * room.price;

  return (
    <div className="border border-border bg-white">
      {/* DATE */}
      <div className="flex justify-between items-center p-4 border-b border-border">
        {/* Check in */}
        <div>
          <div className="text-xs text-gray-500 uppercase">Ngày đến</div>
          <div className="flex items-center gap-2">
            <div className="text-4xl font-semibold">{inDate?.day || "--"}</div>
            <div>
              <div className="text-sm">{inDate?.weekday}</div>
              <div className="text-sm text-gray-500">{inDate?.monthYear}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">từ 13:00</div>
        </div>

        <div className="text-2xl">→</div>

        {/* Check out */}
        <div>
          <div className="text-xs text-gray-500 uppercase">Ngày đi</div>
          <div className="flex items-center gap-2">
            <div className="text-4xl font-semibold">{outDate?.day || "--"}</div>
            <div>
              <div className="text-sm">{outDate?.weekday}</div>
              <div className="text-sm text-gray-500">{outDate?.monthYear}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">đến 12:00</div>
        </div>
      </div>

      {/* ROOM INFO */}
      <div className="p-4 border-b border-border text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Phòng</span>
          <span className="font-medium">{room.name}</span>
        </div>

        <div className="flex justify-between mt-1">
          <span className="text-gray-500">Ở lại</span>
          <span>
            {adults} người lớn , {children} trẻ em
          </span>
        </div>

        <div className="flex justify-between mt-3 border-t border-border pt-3">
          <span className="text-gray-500">Giá (1 đêm x 1 phòng)</span>
          <span>{room.price.toLocaleString("vi-VN")} đ</span>
        </div>

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setOpenEdit(true)}
            className="text-blue-500 text-sm cursor-pointer hover:underline"
          >
            Chỉnh sửa
          </button>

          <button
            onClick={clearBooking}
            className="text-red-500 text-sm cursor-pointer hover:underline"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* TOTAL */}
      <div className="p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Tổng phụ</span>
          <span>{total.toLocaleString("vi-VN")} đ</span>
        </div>

        <div className="flex justify-between font-semibold text-base mt-1">
          <span>Tổng</span>
          <span>{total.toLocaleString("vi-VN")} đ</span>
        </div>
      </div>

      {/* BUTTON */}
      <div className="p-4">
        <button
          disabled={!isValid}
          onClick={() => {
            if (!isValid) {
              toast.error("Vui lòng nhập đầy đủ thông tin");
              return;
            }
            router.push("/checkout");
            toast.success("Chuyển sang thanh toán");
          }}
          className="w-full py-3 font-medium text-white rounded-lg
    bg-blue-500 hover:bg-blue-600
    disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          CHECKOUT
        </button>
      </div>
      <EditBookingModal open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
};

export default BookingSummary;
