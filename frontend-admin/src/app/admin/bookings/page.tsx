"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import {
  BookingDto,
  getAdminBookings,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  completeBooking,
  noShowBooking,
  cancelBooking,
} from "@/services/bookingService";

const formatMoney = (value: number | string) => {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "confirmed":
      return "info";
    case "checked_in":
      return "primary";
    case "checked_out":
      return "success";
    case "completed":
      return "success";
    case "cancelled":
    case "no_show":
      return "error";
    default:
      return "dark";
  }
};

type ActionItem = {
  key: string;
  label: string;
  action: (id: number) => Promise<BookingDto>;
  color: string;
};

const getActions = (status: string): ActionItem[] => {
  if (status === "pending") {
    return [
      { key: "confirm", label: "Xác nhận", action: confirmBooking, color: "bg-green-500 hover:bg-green-600" },
      { key: "cancel", label: "Hủy", action: cancelBooking, color: "bg-red-500 hover:bg-red-600" },
    ];
  }

  if (status === "confirmed") {
    return [
      { key: "check-in", label: "Check-in", action: checkInBooking, color: "bg-blue-500 hover:bg-blue-600" },
      { key: "no-show", label: "No-show", action: noShowBooking, color: "bg-orange-500 hover:bg-orange-600" },
      { key: "cancel", label: "Hủy", action: cancelBooking, color: "bg-red-500 hover:bg-red-600" },
    ];
  }

  if (status === "checked_in") {
    return [{ key: "check-out", label: "Check-out", action: checkOutBooking, color: "bg-indigo-500 hover:bg-indigo-600" }];
  }

  if (status === "checked_out") {
    return [{ key: "complete", label: "Hoàn thành", action: completeBooking, color: "bg-teal-500 hover:bg-teal-600" }];
  }

  return [];
};

const PAGE_SIZE = 5;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAdminBookings();
      setBookings(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAction = async (
    booking: BookingDto,
    label: string,
    action: (id: number) => Promise<BookingDto>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updatedBooking = await toast.promise(action(booking.id), {
        loading: `${label}...`,
        success: `${label} thành công`,
        error: `Lỗi ${label}`,
      });

      const nextBooking = updatedBooking.rooms && updatedBooking.rooms.length > 0
        ? updatedBooking
        : { ...updatedBooking, rooms: booking.rooms };

      setBookings((prev) => prev.map((item) => (item.id === booking.id ? nextBooking : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Lỗi thực hiện ${label}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const customerName = `${booking.guest_name || ""} ${booking.user?.name || ""}`.trim().toLowerCase();
    return customerName.includes(searchText.trim().toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const currentBookings = filteredBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý đặt phòng</h1>
          <p className="text-sm text-gray-500">Tìm kiếm theo tên khách hàng hoặc tên người đặt.</p>
        </div>
        <div className="w-full max-w-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="booking-search">
            Tìm theo khách hàng
          </label>
          <input
            id="booking-search"
            type="text"
            placeholder="Nhập tên khách hàng..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-brand-400 dark:focus:ring-brand-500/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2 font-medium">STT</th>
              <th className="px-4 py-2 font-medium">Khách</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Check-in</th>
              <th className="px-4 py-2 font-medium">Check-out</th>
              <th className="px-4 py-2 font-medium">Giá</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
              <th className="px-4 py-2 font-medium">Phòng</th>
              <th className="px-4 py-2 font-medium">Người tạo</th>
              <th className="px-4 py-2 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  Không tìm thấy booking phù hợp.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking, index) => {
                const rooms = booking.rooms?.map((room) => room.room_number || `#${room.id}`).join(", ") || "-";
                const actor = booking.user?.name || booking.guest_name || "-";
                const availableActions = getActions(booking.status);
                const rowNumber = (currentPage - 1) * PAGE_SIZE + index + 1;

                return (
                  <tr key={booking.id} className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 align-top">{rowNumber}</td>
                    <td className="px-4 py-3 align-top">{booking.guest_name}</td>
                    <td className="px-4 py-3 align-top">{booking.guest_email || "-"}</td>
                    <td className="px-4 py-3 align-top">{new Date(booking.check_in).toLocaleDateString("vi-VN")}</td>
                    <td className="px-4 py-3 align-top">{new Date(booking.check_out).toLocaleDateString("vi-VN")}</td>
                    <td className="px-4 py-3 align-top">{formatMoney(booking.total_price)}</td>
                    <td className="px-4 py-3 align-top">
                      <Badge color={getStatusColor(booking.status)} variant="light" size="sm">
                        {booking.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 align-top">{rooms}</td>
                    <td className="px-4 py-3 align-top">{actor}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-2">
                        {availableActions.map((item) => (
                          <button
                            key={item.key}
                            className={`rounded-lg px-3 py-1 text-xs font-medium text-white ${item.color}`}
                            onClick={() => handleAction(booking, item.label, item.action)}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {filteredBookings.length > PAGE_SIZE && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Hiển thị {currentBookings.length} / {filteredBookings.length} booking
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
          </div>
        )}
      </div>
    </div>
  );
}
