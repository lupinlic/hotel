"use client";
import { useBookingStore } from "@/store/booking";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Copy, Check } from "lucide-react";
import { useCreatePayment } from "@/hooks/usePayments";
import { useCreateBooking } from "@/hooks/useBookings";
import { useGetUser } from "@/hooks/useAuth";

export default function Payment() {
  const router = useRouter();
  const { room, checkIn, checkOut, bookingId, paymentMethod, guestName, guestEmail, guestPhone, specialRequests, adults, children, setBooking } = useBookingStore();
  const createBookingMutation = useCreateBooking();
  const createPaymentMutation = useCreatePayment();
  const { data: user } = useGetUser();

  const isLoggedIn = !!user;

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "waiting" | "success">("idle");

  const nights =
    checkIn && checkOut
      ? (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
      : 1;

  if (!room) {
    router.push("/room");
    return null;
  }

  const subtotal = nights * room.price;
  const bankDiscount = paymentMethod === "bank" ? subtotal * 0.1 : 0;
  const loginDiscount = isLoggedIn ? subtotal * 0.05 : 0;
  const total = subtotal - bankDiscount - loginDiscount;

  const accountNumber = "123456789";

  const qrUrl = `https://img.vietqr.io/image/vietcombank-${accountNumber}-qr_only.png?amount=${total}&addInfo=BOOKING ${room.id}&accountName=NGUYEN VAN A`;

  // 👉 xử lý click thanh toán
  const handlePaid = async () => {
    setLoading(true);
    setStatus("waiting");

    try {
      let bookingIdToUse = bookingId;

      if (!bookingIdToUse) {
        // Tạo booking khi lần đầu thanh toán chuyển khoản (bank)
        const createBookingPayload = {
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          check_in: checkIn,
          check_out: checkOut,
          total_guests: adults + children,
          room_type_id: room.id,
          total_price: total,
          special_requests: specialRequests,
        };

        const booking = await createBookingMutation.mutateAsync(createBookingPayload);
        bookingIdToUse = booking.id;
        setBooking({ bookingId: bookingIdToUse });
      }

      await createPaymentMutation.mutateAsync({
        booking_id: bookingIdToUse,
        amount: total,
        payment_method: "bank_transfer",
      });

      setStatus("success");

      setTimeout(() => {
        router.push("/thank-you");
      }, 1500);
    } catch (error: any) {
      toast.error(error?.message || "Thanh toán thất bại");
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  // 👉 copy STK
  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 grid md:grid-cols-2 gap-6">
      {/* LEFT */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Thanh toán chuyển khoản</h2>

        <div className=" p-4 rounded-lg space-y-2">
          <div>Ngân hàng: Vietcombank</div>

          <div className="flex items-center gap-2">
            <span>Số tài khoản: {accountNumber}</span>
            <button
              onClick={handleCopy}
              className="text-sm px-2 py-1 cursor-pointer rounded"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <div>Chủ tài khoản: NGUYEN VAN A</div>

          <div className="text-sm text-gray-500">
            {isLoggedIn
              ? "Bạn là khách đăng nhập, được giảm 5%"
              : "Đăng nhập để được giảm 5%"}
          </div>

          {bankDiscount > 0 && (
            <div className="text-sm text-green-600">Giảm giá chuyển khoản: {bankDiscount.toLocaleString("vi-VN")} đ</div>
          )}

          {isLoggedIn && (
            <div className="text-sm text-green-600">Giảm giá đăng nhập: {loginDiscount.toLocaleString("vi-VN")} đ</div>
          )}

          <div className="font-semibold text-red-500">
            Số tiền: {total.toLocaleString("vi-VN")} đ
          </div>

          <div className="text-sm text-gray-500">
            Nội dung: BOOKING {room.id}
          </div>
        </div>

        {/* trạng thái */}
        {status === "waiting" && (
          <div className="text-yellow-600 font-medium">
            ⏳ Đang chờ xác nhận thanh toán...
          </div>
        )}

        {status === "success" && (
          <div className="text-green-600 font-medium">
            ✅ Thanh toán thành công!
          </div>
        )}

        <button
          onClick={handlePaid}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white cursor-pointer ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Đang xử lý..." : "Tôi đã chuyển khoản"}
        </button>
      </div>

      {/* RIGHT - QR */}
      <div className="flex flex-col items-center justify-center  p-4 rounded-lg">
        <p className="mb-3 font-medium">Quét QR để thanh toán</p>
        <img src={qrUrl} alt="QR Code" className="w-60 h-60" />
      </div>
    </div>
  );
}
