"use client";

import { useMyBookings, useCancelBooking } from "@/hooks/useBookings";
import { Calendar, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "N/A";
  }
};

const getDaysUntilCheckIn = (checkInDate: string) => {
  const checkIn = new Date(checkInDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  checkIn.setHours(0, 0, 0, 0);
  return Math.floor(
    (checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
};

export default function MyBookings() {
  const { data: bookings, isLoading, refetch } = useMyBookings(true);
  const cancelBooking = useCancelBooking();
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const canCancelBooking = (checkInDate: string) => {
    return getDaysUntilCheckIn(checkInDate) >= 1;
  };

  const handleCancel = (bookingId: number, checkInDate: string) => {
    if (!canCancelBooking(checkInDate)) {
      toast.error("Chỉ được hủy booking trước ngày nhận phòng ít nhất 1 ngày");
      return;
    }

    setCancellingId(bookingId);
    cancelBooking.mutate(bookingId, {
      onSuccess: () => {
        toast.success("Hủy booking thành công");
        setCancellingId(null);
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Hủy booking thất bại");
        setCancellingId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const booking = bookings?.[0];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Các phòng đã đặt</h2>

      {!bookings || bookings.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Bạn chưa có booking nào</p>
          <Link
            href="/room"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Đặt phòng ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Booking #{booking.id}
                  </h3>

                  <div className="space-y-3 text-sm">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`px-3 py-1 rounded text-white text-xs font-medium ${
                          booking.status === "pending"
                            ? "bg-yellow-500"
                            : booking.status === "confirmed"
                            ? "bg-blue-500"
                            : booking.status === "checked_in"
                            ? "bg-indigo-500"
                            : booking.status === "checked_out"
                            ? "bg-sky-500"
                            : booking.status === "completed"
                            ? "bg-green-500"
                            : booking.status === "cancelled"
                            ? "bg-red-500"
                            : booking.status === "no_show"
                            ? "bg-gray-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {booking.status === "pending"
                          ? "Chờ xác nhận"
                          : booking.status === "confirmed"
                          ? "Đã xác nhận"
                          : booking.status === "checked_in"
                          ? "Đã nhận phòng"
                          : booking.status === "checked_out"
                          ? "Đã trả phòng"
                          : booking.status === "completed"
                          ? "Hoàn thành"
                          : booking.status === "cancelled"
                          ? "Đã hủy"
                          : booking.status === "no_show"
                          ? "Không đến"
                          : "Không xác định"}
                        
                      </span>
                    </div>
                    {/* Dates */}
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-600" />
                      <span>
                        {formatDate(booking.check_in)} -{" "}
                        {formatDate(booking.check_out)}
                      </span>
                    </div>

                    {/* Guests */}
                    <div>
                      <span className="text-gray-600">Số khách: </span>
                      <span className="font-medium">
                        {booking.total_guests}
                      </span>
                    </div>

                    {/* Price */}
                    <div>
                      <span className="text-gray-600">Tổng tiền: </span>
                      <span className="font-medium text-orange-500">
                        {Number(booking.total_price).toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    {/* Guest Info */}
                    <div className="border-t pt-3">
                      <p className="text-gray-600 text-xs mb-2">
                        Thông tin khách:
                      </p>
                      <p>
                        <span className="text-gray-600">Tên: </span>
                        {booking.guest_name}
                      </p>
                      <p>
                        <span className="text-gray-600">Email: </span>
                        {booking.guest_email}
                      </p>
                      <p>
                        <span className="text-gray-600">SĐT: </span>
                        {booking.guest_phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Room Info */}
                <div>
                  {booking.rooms && booking.rooms.length > 0 ? (
                    <div className="space-y-3">
                      {booking.rooms.map((room) => (
                        <div
                          key={room.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <h4 className="font-semibold mb-3 text-lg">
                            {room.room_type?.name || "Phòng"}
                          </h4>

                          <div className="space-y-2 text-sm mb-4">
                            <p>
                              <span className="text-gray-600">Số phòng: </span>
                              <span className="font-medium">
                                {room.room_number || "N/A"}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">Giá/đêm: </span>
                              <span className="font-medium">
                                {Number(
                                  room.room_type?.price ??
                                    room.room_type?.price_per_night ??
                                    0,
                                ).toLocaleString("vi-VN")}{" "}
                                đ
                              </span>
                            </p>
                          </div>

                          <Link
                            href={`/room_type/${room.room_type?.id}`}
                            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                          >
                            <Eye size={16} />
                            Xem phòng
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Thông tin phòng không có</p>
                  )}

                  {/* Payment Info */}
                  {booking.payment ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold mb-3 text-base text-green-900">
                        💳 Thông tin thanh toán
                      </h4>

                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">Số tiền: </span>
                          <span className="font-medium text-orange-500">
                            {Number(booking.payment.amount).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            đ
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Phương thức: </span>
                          <span className="font-medium capitalize">
                            {booking.payment.method === "card" ||
                            booking.payment.method === "credit_card"
                              ? "Thẻ tín dụng"
                              : booking.payment.method === "bank" ||
                                  booking.payment.method === "bank_transfer"
                                ? "Chuyển khoản"
                                : booking.payment.method === "cash"
                                  ? "Thanh toán tại quầy"
                                  : booking.payment.method}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Trạng thái: </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              booking.payment.status === "completed"
                                ? "bg-green-500 text-white"
                                : booking.payment.status === "pending"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-red-500 text-white"
                            }`}
                          >
                            {booking.payment.status === "completed"
                              ? "Đã thanh toán"
                              : booking.payment.status === "pending"
                                ? "Chờ thanh toán"
                                : "Thanh toán thất bại"}
                          </span>
                        </p>
                        {booking.payment.transaction_id && (
                          <p>
                            <span className="text-gray-600">
                              ID giao dịch:{" "}
                            </span>
                            <span className="font-mono text-xs">
                              {booking.payment.transaction_id}
                            </span>
                          </p>
                        )}
                        {booking.payment.paid_at && (
                          <p>
                            <span className="text-gray-600">
                              Ngày thanh toán:{" "}
                            </span>
                            <span className="font-medium">
                              {formatDate(booking.payment.paid_at)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <p className="text-gray-700 text-sm">
                        Chưa có thông tin thanh toán
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t mt-6 pt-4 flex gap-2">
                {booking.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(booking.id, booking.check_in)}
                    disabled={cancellingId === booking.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm ${
                      canCancelBooking(booking.check_in)
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 size={16} />
                    {cancellingId === booking.id
                      ? "Đang hủy..."
                      : "Hủy booking"}
                  </button>
                )}
                <p className="text-xs text-gray-500 self-center ml-auto">
                  {booking.status === "cancelled"
                    ? "Booking đã hủy"
                    : !canCancelBooking(booking.check_in)
                      ? "Không thể hủy (quá gần ngày nhận phòng)"
                      : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
