"use client";

import { useState, KeyboardEvent } from "react";
import toast from "react-hot-toast";
import { useVerifyOtp, useResendOtp } from "@/hooks/useAuth";

export default function OtpModal({
  email,
  onClose,
  onSuccess,
}: {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const fillOtp = otp.join("");

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput && index < 5) {
        const target = document.getElementById(`otp-${index + 2}`) as HTMLInputElement;
        target?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    if (fillOtp.length !== 6) {
      return toast.error("OTP phải 6 số");
    }

    verifyMutation.mutate(
      { email, otp: fillOtp },
      {
        onSuccess: () => {
          toast.success("Xác thực thành công 🎉");
          onSuccess();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || "OTP sai");
        },
      }
    );
  };

  const handleResend = () => {
    resendMutation.mutate(
      { email },
      {
        onSuccess: () => toast.success("Đã gửi lại OTP"),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-70">
      <div className="bg-white p-6 rounded-xl w-[350px] text-center space-y-4">
        <h2 className="text-xl font-bold">Nhập mã OTP</h2>

        <div className="grid grid-cols-6 gap-2">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index + 1}`}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-full h-12 text-center border border-gray-400 rounded-lg text-xl font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-medium transition cursor-pointer" 
        >
          Xác nhận
        </button>

        <button
          onClick={handleResend}
          className="text-sm text-gray-500 mr-4 underline hover:text-gray-700 transition cursor-pointer"
        >
          Gửi lại OTP
        </button>

        <button onClick={onClose} className="text-sm text-red-400 hover:text-red-600 transition cursor-pointer">
          Hủy
        </button>
      </div>
    </div>
  );
}