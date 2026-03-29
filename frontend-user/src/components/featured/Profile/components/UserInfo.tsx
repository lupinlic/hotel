"use client";

import { User as UserIcon, Mail, Calendar } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserInfo({ user }: { user: User }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h2>

      <div className="space-y-4">
        {/* Name */}
        <div className="flex items-center gap-3">
          <UserIcon className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-500">Họ tên</p>
            <p className="font-medium">{user.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center gap-3">
          <Calendar className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-500">Loại tài khoản</p>
            <p className="font-medium capitalize">{user.role === "admin" ? "Quản trị viên" : "Khách hàng"}</p>
          </div>
        </div>
      </div>

      <hr className="my-6" />

      <p className="text-xs text-gray-500 text-center">
        ID: {user.id}
      </p>
    </div>
  );
}
