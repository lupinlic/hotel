"use client";

import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useLogin, useRegister } from "@/hooks/useAuth";
import ForgotPasswordModal from   "./ForgotPasswordModal";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // ✅ tách state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // ✅ handle change riêng
  const handleLoginChange = (e: any) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: any) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  // ✅ validate riêng
  const validateLogin = () => {
    if (!loginForm.email.includes("@")) return "Email không hợp lệ";
    if (loginForm.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    return "";
  };

  const validateRegister = () => {
    if (!registerForm.name.trim()) return "Tên không được để trống";
    if (!registerForm.email.includes("@")) return "Email không hợp lệ";
    if (registerForm.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    return "";
  };

  // ✅ login
  const handleLogin = () => {
    const err = validateLogin();
    if (err) return toast.error(err);

    loginMutation.mutate(
      {
        email: loginForm.email,
        password: loginForm.password,
      },
      {
        onSuccess: () => {
          toast.success("Đăng nhập thành công 👋");
          setTimeout(() => {
            window.location.reload();
          }, 800);
        },
        onError: (error: any) => {
          toast.error(error.message || error.response?.data?.message || "Đăng nhập thất bại");
        },
      },
    );
  };

  // ✅ register
  const handleRegister = () => {
    const err = validateRegister();
    if (err) return toast.error(err);

    registerMutation.mutate(registerForm, {
      onSuccess: (data: any) => {
        if (data?.success === false) {
          toast.error(data.message || "email đã tồn tại . Vui lòng dùng email khác");
          return;
        }

        toast.success("Đăng ký thành công. Bạn có thể đăng nhập 🎉");
        setIsRegister(false);
        setRegisterForm({ name: "", email: "", password: "" });
      },
      onError: (error: any) => {
        toast.error(error.message || error.response?.data?.message || "Đăng ký thất bại");
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
      <div className="relative w-[800px] h-[500px] bg-white rounded-2xl overflow-hidden shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 z-20">
          ✕
        </button>

        <div className="absolute inset-0 flex">
          {/* LOGIN */}
          <div className="w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-5">
              <h2 className="text-3xl font-bold text-center">Đăng nhập</h2>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg border-border outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg border-border outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div className="text-right">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loginMutation.isPending}
                className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 font-medium"
              >
                {loginMutation.isPending ? "Đang xử lý..." : "Đăng nhập"}
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">hoặc</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>

                <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-medium">Facebook</span>
                </button>
              </div>
            </div>
          </div>

          {/* REGISTER */}
          <div className="w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-5">
              <h2 className="text-3xl font-bold text-center">Đăng ký</h2>

              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="name"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  placeholder="Tên"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg border-border outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg border-border outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="password"
                  type="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg border-border outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={registerMutation.isPending}
                className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 font-medium"
              >
                {registerMutation.isPending ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">hoặc</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>

                <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-medium">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* OVERLAY */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ${
            isRegister ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="relative w-full h-full flex items-center justify-center text-white">
            <img
              src="/image/introduce.jpg"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10 text-center">
              {isRegister ? (
                <>
                  <h2 className="text-2xl font-bold">Xin chào!</h2>
                  <button
                    onClick={() => setIsRegister(false)}
                    className="mt-4 border px-6 py-2 rounded-full"
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">Chào mừng trở lại!</h2>
                  <button
                    onClick={() => setIsRegister(true)}
                    className="mt-4 border px-6 py-2 rounded-full"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
}
