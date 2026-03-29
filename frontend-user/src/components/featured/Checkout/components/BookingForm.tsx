"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useBookingStore } from "@/store/booking";
import { useCreateBooking } from "@/hooks/useBookings";
import { useCreatePayment } from "@/hooks/usePayments";
import { useRouter } from "next/dist/client/components/navigation";
import AuthModal from "@/components/featured/AuthModal";
import { useGetUser } from "@/hooks/useAuth";

function BookingForm() {
  const { paymentMethod: storedPaymentMethod } = useBookingStore();
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    arrivalTime: "",
    note: "",
    paymentMethod: storedPaymentMethod || "hotel",
    agree: false,
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const router = useRouter();
  const setBooking = useBookingStore((s) => s.setBooking);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setForm({
      ...form,
      [name]: newValue,
    });

    if (name === "paymentMethod") {
      setBooking({ paymentMethod: value });
    }
  };

  const createBookingMutation = useCreateBooking();
  const createPaymentMutation = useCreatePayment();
  const { room, checkIn, checkOut, adults, children, paymentMethod, clearBooking } =
    useBookingStore();
  const { data: user } = useGetUser();

  useEffect(() => {
    if (paymentMethod && paymentMethod !== form.paymentMethod) {
      setForm((prev) => ({ ...prev, paymentMethod }));
    }
  }, [paymentMethod]);

  const submitBooking = async (isGuest: boolean) => {
    if (!room || !checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Thông tin đặt phòng không hợp lệ");
      return;
    }

    setBooking({
      guestName: form.fullname,
      guestEmail: form.email,
      guestPhone: form.phone,
      specialRequests: form.note,
      paymentMethod: form.paymentMethod,
    });

    if (!form.fullname || !form.phone || !form.email) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const nights =
      checkIn && checkOut
        ? (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
        : 1;

    const subtotal = nights * room.price;
    const bankDiscount = form.paymentMethod === "bank" ? subtotal * 0.1 : 0;
    const loginDiscount = user ? subtotal * 0.05 : 0;
    const totalPrice = subtotal - bankDiscount - loginDiscount;

    const payload = {
      guest_name: form.fullname,
      guest_email: form.email,
      guest_phone: form.phone,
      check_in: checkIn,
      check_out: checkOut,
      total_guests: adults + children,
      room_type_id: room.id,
      total_price: totalPrice,
      special_requests: form.note,
    };

    try {
      if (form.paymentMethod === "hotel") {
        const booking = await createBookingMutation.mutateAsync(payload);
        toast.success("Đặt phòng thành công!" + (isGuest ? " Bạn đã đặt phòng với giá gốc (không có giảm giá 5%)." : " Bạn đã được giảm 5% vì đã đăng nhập."));
        setBooking({ bookingId: booking.id, paymentMethod: form.paymentMethod });

        await createPaymentMutation.mutateAsync({
          booking_id: booking.id,
          amount: totalPrice,
          payment_method: "cash",
        });

        router.push("/thank-you");
      } else {
        // Chuyển sang trang payment trước khi lưu booking/product
        setBooking({ bookingId: undefined, paymentMethod: form.paymentMethod });
        toast.success("Đặt phòng tạm thời thành công. Vui lòng chờ thanh toán ngân hàng.");
        router.push("/payment");
      }
    } catch (err: any) {
      toast.error(err?.message || "Đặt phòng thất bại, vui lòng thử lại");
    }
  };

  const handleSubmit = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    submitBooking(false);
  };

  return (
    <div className=" bg-white p-6 rounded-xl space-y-5">
      <h2 className="text-lg font-semibold">Thông tin đặt phòng</h2>

      {/* Fullname */}
      <div>
        <label className="text-sm text-gray-600">Họ và tên</label>
        <input
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          className="w-full border border-border bg-none outline-none rounded-lg px-3 py-2 mt-1"
          placeholder="Nguyễn Văn A"
        />
      </div>

      {/* Phone */}
      <div className="flex gap-6 w-full">
        <div className="w-full">
          <label className="text-sm text-gray-600">Số điện thoại</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-border outline-none rounded-lg px-3 py-2 mt-1"
            placeholder="0123456789"
          />
        </div>

        {/* Email */}
        <div className="w-full">
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-border outline-none rounded-lg px-3 py-2 mt-1"
            placeholder="email@example.com"
          />
        </div>
      </div>
      {/* Arrival Time */}
      <div>
        <label className="text-sm text-gray-600">
          Thời gian nhận phòng dự kiến
        </label>
        <select
          name="arrivalTime"
          value={form.arrivalTime}
          onChange={handleChange}
          className="w-full border border-border outline-none rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Chọn thời gian</option>
          <option value="morning">Sáng (8:00 - 12:00)</option>
          <option value="afternoon">Chiều (12:00 - 18:00)</option>
          <option value="evening">Tối (18:00 - 22:00)</option>
        </select>
      </div>

      {/* Note */}
      <div>
        <label className="text-sm text-gray-600">Yêu cầu đặc biệt</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1 border-border outline-none"
          rows={3}
          placeholder="Ví dụ: phòng tầng cao, không hút thuốc..."
        />
      </div>

      {/* Payment */}
      <div>
        <label className="text-sm text-gray-600">Phương thức thanh toán</label>
        <div className="mt-2 space-y-3">
          {/* HOTEL */}
          <label
            className={`block border rounded-lg p-3 cursor-pointer transition
      ${
        form.paymentMethod === "hotel"
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300"
      }`}
          >
            <div className="flex items-start gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="hotel"
                checked={form.paymentMethod === "hotel"}
                onChange={handleChange}
                className="mt-1"
              />

              <div>
                <div className="font-medium text-gray-800">
                  Thanh toán tại khách sạn
                </div>
                <div className="text-sm text-gray-500">
                  Bạn sẽ thanh toán khi nhận phòng tại khách sạn, không cần
                  thanh toán trước <br></br>
                  <span className="text-[12px] text-gray-500">
                    (Giữ phòng đến 18:00 ngày check-in, nếu không sẽ tự động
                    hủy)
                  </span>
                </div>
              </div>
            </div>
          </label>

          {/* BANK */}
          <label
            className={`block border rounded-lg p-3 cursor-pointer transition
      ${
        form.paymentMethod === "bank"
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300"
      }`}
          >
            <div className="flex items-start gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={form.paymentMethod === "bank"}
                onChange={handleChange}
                className="mt-1"
              />

              <div>
                <div className="font-medium text-gray-800">
                  Chuyển khoản ngân hàng
                </div>
                <div className="text-sm text-gray-500">
                  Thanh toán trước qua tài khoản ngân hàng để xác nhận đặt phòng
                  <br></br>
                  <span className="text-[12px] text-gray-500">
                    (Giữ phòng đến 18:00 ngày check-out, giảm 10% hóa đơn)
                  </span>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Agree */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="agree"
          checked={form.agree}
          onChange={handleChange}
        />
        <span className="text-sm text-gray-600">
          Tôi đồng ý với điều khoản và chính sách
        </span>
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="w-[180px] py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium cursor-pointer"
      >
        ĐẶT PHÒNG
      </button>

      {/* Login prompt modal for guest */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-3">Bạn chưa đăng nhập</h3>
            <p className="text-gray-600 mb-5">
              Đăng nhập ngay để được giảm 5% trên tổng giá trị đơn hàng. Bạn có muốn đăng nhập?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  submitBooking(true);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Tiếp tục khách vãng lai
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  setShowAuth(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default BookingForm;
