"use client";
import { useState } from "react";
import { Mail, Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // 👉 validate
  const validate = () => {
    if (!form.email.includes("@")) return "Email không hợp lệ";
    if (form.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    if (isRegister && form.password !== form.confirmPassword)
      return "Mật khẩu không khớp";
    return "";
  };

  // 👉 mock register
  const handleRegister = () => {
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const exist = users.find((u: any) => u.email === form.email);
      if (exist) {
        toast.error("Email đã tồn tại");
        setLoading(false);
        return;
      }

      users.push({ email: form.email, password: form.password });
      localStorage.setItem("users", JSON.stringify(users));

      setLoading(false);

      toast.success("Đăng ký thành công 🎉");

      // 👉 delay rồi mới slide
      setTimeout(() => {
        setIsRegister(false);
      }, 800);
    }, 1000);
  };

  // 👉 mock login
  const handleLogin = () => {
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const user = users.find(
        (u: any) => u.email === form.email && u.password === form.password,
      );

      if (!user) {
        toast.error("Sai email hoặc mật khẩu");
        setLoading(false);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));

      toast.success("Đăng nhập thành công 👋");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
      <div className="relative w-[800px] h-[500px] bg-white rounded-2xl overflow-hidden shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 z-20">
          ✕
        </button>

        {/* FORM */}
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
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg"
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
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg"
                />
              </div>

              {error && !isRegister && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </div>
          </div>

          {/* REGISTER */}
          <div className="w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-5">
              <h2 className="text-3xl font-bold text-center">Đăng ký</h2>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg"
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
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg"
                />
              </div>

              <div className="relative">
                <CheckCircle
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg"
                />
              </div>

              {error && isRegister && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition cursor-pointer "
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </div>
          </div>
        </div>

        {/* OVERLAY giữ nguyên của bạn */}
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
                    className="mt-4 border px-6 py-2 rounded-full  transition cursor-pointer"
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">Chào mừng trở lại!</h2>
                  <button
                    onClick={() => setIsRegister(true)}
                    className="mt-4 border px-6 py-2 rounded-full  transition cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
