"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import toast from 'react-hot-toast';
import SignInForm from "@/components/auth/SignInForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      if (response.user.role !== "admin") {
        toast.error("Bạn không có quyền truy cập admin.");
        return;
      }
      // Lưu token vào cookies
      document.cookie = `token=${response.token}; path=/; max-age=86400`; // 1 ngày
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message || "Đăng nhập thất bại.");
    }
  };

  return <SignInForm onLogin={handleLogin} />;
}