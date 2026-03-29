"use client";
import { useBookingStore } from "@/store/booking";
import { useGetUser } from "@/hooks/useAuth";

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
  const { room, checkIn, checkOut, adults, children, paymentMethod } =
    useBookingStore();
  const { data: user } = useGetUser();
  const isLoggedIn = !!user;

  if (!room) {
    return (
      <div className="border border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50">
        <div className="text-4xl mb-3">🏨</div>
        <div className="font-semibold text-gray-700">Chưa chọn phòng</div>
        <div className="text-sm text-gray-500 mt-1">
          Vui lòng chọn phòng để tiếp tục đặt
        </div>
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

  const subtotal = nights * room.price;

  const bankDiscount = paymentMethod === "bank" ? subtotal * 0.1 : 0;
  const loginDiscount = isLoggedIn ? subtotal * 0.05 : 0;

  const total = subtotal - bankDiscount - loginDiscount;

  return (
    <div className="border border-border bg-white">
      {/* DATE */}
      <div className="flex justify-between items-center p-4 border-b border-border">
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
          <span className="text-gray-500">Giá (1 đêm)</span>
          <span>{room.price.toLocaleString("vi-VN")} đ</span>
        </div>
      </div>

      {/* TOTAL */}
      <div className="p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Số đêm</span>
          <span>{nights}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Tổng phụ</span>
          <span>{subtotal.toLocaleString("vi-VN")} đ</span>
        </div>

        {/* 🔥 Discount */}
        {paymentMethod === "bank" && (
          <>
            <div className="flex justify-between text-green-600">
              <span>Giảm giá (10%)</span>
              <span>-{bankDiscount.toLocaleString("vi-VN")} đ</span>
            </div>

            <div className="text-green-600 text-xs">
              Bạn đã tiết kiệm {bankDiscount.toLocaleString("vi-VN")} đ
            </div>
          </>
        )}
        {/* Login Discount */}
        {isLoggedIn && (
          <>
            <div className="flex justify-between text-green-600">
              <span>Giảm giá đăng nhập (5%)</span>
              <span>-{loginDiscount.toLocaleString("vi-VN")} đ</span>
            </div>

            <div className="text-green-600 text-xs">
              Bạn đã tiết kiệm {loginDiscount.toLocaleString("vi-VN")} đ nhờ đăng nhập
            </div>
          </>
        )}
        <div className="flex justify-between font-semibold text-base pt-2 border-t">
          <span>Tổng</span>
          <span>{total.toLocaleString("vi-VN")} đ</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
