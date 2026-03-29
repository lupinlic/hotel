"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      toast.error("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Gọi API backend để gửi email reset password
      // const response = await fetch(`${API_URL}/auth/forgot-password`, {
      //   method: 'POST',
      //   body: JSON.stringify({ email }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Giả lập request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      toast.success("Email đặt lại mật khẩu đã được gửi");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-70">
      <div className="w-[400px] bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Quên mật khẩu?</h2>
            <p className="text-gray-600 text-sm mb-6">
              Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
            </p>

            <div className="relative mb-6">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg border-gray-300 outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 font-medium transition disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Gửi hướng dẫn"}
            </button>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Kiểm tra email của bạn</h2>
              <p className="text-gray-600 text-sm mb-6">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới <strong>{email}</strong>
              </p>
              <p className="text-gray-500 text-xs mb-6">
                Nếu không thấy email, vui lòng kiểm tra thư mục Spam
              </p>

              <button
                onClick={onClose}
                className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 font-medium transition"
              >
                Đã xong
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
