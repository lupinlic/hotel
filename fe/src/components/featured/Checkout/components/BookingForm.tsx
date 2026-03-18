"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useBookingStore } from "@/store/booking";
import { useRouter } from "next/dist/client/components/navigation";
import AuthModal from "@/components/featured/AuthModal";

function BookingForm() {
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    arrivalTime: "",
    note: "",
    paymentMethod: "hotel",
    agree: false,
  });
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

  const handleSubmit = () => {
    const currentUser = localStorage.getItem("currentUser");

    // 👉 chưa login
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập trước");
      setShowAuth(true);
      return;
    }

    // validate form
    if (!form.fullname || !form.phone || !form.email) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!form.agree) {
      toast.error("Bạn phải đồng ý điều khoản");
      return;
    }

    setBooking({
      paymentMethod: form.paymentMethod,
    });

    if (form.paymentMethod === "hotel") {
      router.push("/thank-you");
    } else {
      router.push("/payment");
    }
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
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default BookingForm;
