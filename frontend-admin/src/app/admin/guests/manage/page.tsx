"use client";

import React, { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser, UserDto } from "@/services/userService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import GuestForm from "@/components/guests/GuestForm";

export default function GuestsManagePage() {
  const [customers, setCustomers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editGuest, setEditGuest] = useState<UserDto | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getUsers();
        setCustomers(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const onEdit = (user: UserDto) => {
    setEditGuest(user);
    setFormOpen(true);
  };

  const onFormSubmit = async (values: { name: string; email: string; phone?: string; role: string; status: string }) => {
    if (!editGuest) return;
    try {
      await updateUser(editGuest.id, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        status: values.status,
      });
      const data = await getUsers();
      setCustomers(data);
      setEditGuest(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật user");
      throw err;
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa user này?")) return;
    try {
      await deleteUser(id);
      setCustomers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi xóa user");
    }
  };

  return (
    <div className="space-y-4">
      <GuestForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditGuest(null);
        }}
        title={editGuest ? `Sửa khách: ${editGuest.name}` : "Tạo khách hàng"}
        initialData={editGuest ?? undefined}
        onSubmit={onFormSubmit}
      />

      <h1 className="text-2xl font-semibold">Quản lý khách hàng</h1>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Tên</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Điện thoại</th>
              <th className="px-4 py-2 font-medium">Vai trò</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">{item.phone || "-"}</td>
                <td className="px-4 py-2">{item.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status || "Active"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="mr-2 text-blue-600 hover:text-blue-800"
                    onClick={() => onEdit(item)}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => onDelete(item.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
