"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import {
  ArrowUpIcon,
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
  PaperPlaneIcon,
} from "@/icons";

type BookingMetricsProps = {
  metrics: {
    customers: { total: number; admin: number };
    rooms: { total: number; available: number; occupied: number };
    bookings: { total: number; pending: number; confirmed: number };
    revenue: number;
  };
};

export const BookingMetrics = ({ metrics }: BookingMetricsProps) => {
  const customerPercent =
    metrics.customers.total > 0
      ? ((metrics.customers.total - (metrics.customers.admin || 0)) /
          metrics.customers.total) *
        100
      : 0;
  const roomAvailablePercent =
    metrics.rooms.total > 0
      ? (metrics.rooms.available / metrics.rooms.total) * 100
      : 0;
  const bookingConfirmedPercent =
    metrics.bookings.total > 0
      ? (metrics.bookings.confirmed / metrics.bookings.total) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-5 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Khách đặt phòng</span>
            <h4 className="mt-1 font-bold text-gray-800 text-sm dark:text-white/90">
              {metrics.customers.total.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {customerPercent.toFixed(1)}%
          </Badge>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Phòng trống</span>
            <h4 className="mt-1 font-bold text-gray-800 text-sm dark:text-white/90">
              {metrics.rooms.available.toLocaleString()}
            </h4>
          </div>
          <Badge color={roomAvailablePercent > 50 ? "success" : "warning"}>
            {roomAvailablePercent.toFixed(1)}%
          </Badge>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
          <PaperPlaneIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Đơn đặt phòng</span>
            <h4 className="mt-1 font-bold text-gray-800 text-sm dark:text-white/90">
              {metrics.bookings.total.toLocaleString()}
            </h4>
          </div>
          <Badge color={bookingConfirmedPercent > 50 ? "success" : "warning"}>
            {bookingConfirmedPercent.toFixed(1)}%
          </Badge>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Doanh thu</span>
            <h4 className="mt-1 font-bold text-gray-800 text-sm dark:text-white/90">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(metrics.revenue)}
            </h4>
          </div>
          <Badge color="success">+{bookingConfirmedPercent.toFixed(1)}%</Badge>
        </div>
      </div>
    </div>
  );
};
