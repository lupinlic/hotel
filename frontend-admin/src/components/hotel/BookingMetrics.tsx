"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Khách đặt phòng</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.customers.total.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {customerPercent.toFixed(1)}%
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Phòng trống</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.rooms.available.toLocaleString()}
            </h4>
          </div>

          <Badge color={roomAvailablePercent > 50 ? "success" : "warning"}>
            {roomAvailablePercent.toFixed(1)}%
          </Badge>
        </div>
      </div>
    </div>
  );
};
