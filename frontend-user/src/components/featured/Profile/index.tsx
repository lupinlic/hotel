"use client";

import { useGetUser } from "@/hooks/useAuth";
import UserInfo from "./components/UserInfo";
import MyBookings from "./components/MyBookings";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { data: user, isLoading } = useGetUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Thông tin tài khoản</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info - Sidebar */}
        <div className="lg:col-span-1">
          <UserInfo user={user} />
        </div>

        {/* My Bookings - Main content */}
        <div className="lg:col-span-2">
          <MyBookings />
        </div>
      </div>
    </div>
  );
}
