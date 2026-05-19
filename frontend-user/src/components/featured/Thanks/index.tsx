"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/booking";

export default function ThankYou() {
  const router = useRouter();
  const {
    room,
    checkIn,
    checkOut,
    adults,
    children,
    guestName,
    guestEmail,
    guestPhone,
    paymentMethod,
    bookingId,
  } = useBookingStore();

  useEffect(() => {
    if (!room || !bookingId) {
      router.replace("/");
    }
  }, [room, bookingId, router]);

  if (!room || !bookingId) {
    return null;
  }

  const qrData = {
    bookingId,
    room: room.name || room.title || `#${room.id}`,
    checkIn,
    checkOut,
    guests: {
      adults,
      children,
    },
    guest: {
      name: guestName,
      email: guestEmail,
      phone: guestPhone,
    },
    paymentMethod,
  };

  const qrText = JSON.stringify(qrData);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&format=png&data=${encodeURIComponent(qrText)}`;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="rounded-3xl border border-green-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-semibold text-green-600 text-center">
          Đặt phòng thành công 🎉
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Cảm ơn bạn đã đặt phòng. Mã QR dưới đây chứa thông tin phòng và booking.Hãy lưu lại mã QR này để thuận tiện cho việc check-in và quản lý đặt phòng của bạn. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại đã cung cấp. Chúc bạn có một kỳ nghỉ tuyệt vời tại khách sạn của chúng tôi!
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-lg font-semibold mb-3">Thông tin đặt phòng</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-medium">Mã booking:</span> {bookingId}
                </p>
                <p>
                  <span className="font-medium">Phòng:</span> {room.name || room.title || `#${room.id}`}
                </p>
                <p>
                  <span className="font-medium">Check-in:</span> {checkIn}
                </p>
                <p>
                  <span className="font-medium">Check-out:</span> {checkOut}
                </p>
                <p>
                  <span className="font-medium">Khách:</span> {adults} người lớn, {children} trẻ em
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-lg font-semibold mb-3">Thông tin liên hệ</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-medium">Tên:</span> {guestName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {guestEmail}
                </p>
                <p>
                  <span className="font-medium">Điện thoại:</span> {guestPhone}
                </p>
                <p>
                  <span className="font-medium">Thanh toán:</span> {paymentMethod === "hotel" ? "Tại khách sạn" : "Chuyển khoản ngân hàng"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-100 p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">QR thông tin phòng</h3>
            <img src={qrUrl} alt="QR Booking" className="mx-auto h-72 w-72 rounded-xl border border-slate-200 bg-white p-2" />
            <p className="mt-4 text-sm text-slate-600">
              Quét QR để xem nhanh chi tiết đặt phòng.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block rounded-full bg-green-600 px-7 py-3 text-white transition hover:bg-green-700"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

