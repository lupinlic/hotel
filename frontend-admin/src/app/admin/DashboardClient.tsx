"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { BookingMetrics } from "@/components/hotel/BookingMetrics";
import MonthlyOccupancyChart from "@/components/hotel/MonthlyOccupancyChart";
import RevenueChart from "@/components/hotel/RevenueChart";
import RecentBookings from "@/components/hotel/RecentBookings";
import GuestDemographics from "@/components/hotel/GuestDemographics";
import {
  getDashboardMetrics,
  getDashboardOccupancy,
  getDashboardRevenue,
  getGuestDemographics,
  getRecentBookings,
} from "@/services/dashboardService";

type DashboardData = {
  metrics: any;
  occupancy: any;
  revenueReport: any;
  guestStats: any;
  recentBookings: any;
};

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [metrics, occupancy, revenueReport, guestStats, recentBookings] =
          await Promise.all([
            getDashboardMetrics(),
            getDashboardOccupancy(),
            getDashboardRevenue({ period: "month" }),
            getGuestDemographics(),
            getRecentBookings(),
          ]);

        setData({
          metrics,
          occupancy,
          revenueReport,
          guestStats,
          recentBookings,
        });
      } catch (err) {
        console.error("❌ Error loading dashboard:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
      <div className="md:col-span-7 space-y-6">
        <BookingMetrics metrics={data.metrics} />
        <MonthlyOccupancyChart
          occupancyRate={data.occupancy.occupancy_rate}
          monthlyData={data.revenueReport.data.map((item: any) => ({
            label: item.label,
            occupancy_rate: Math.round(Math.random() * 30 + 60),
          }))}
        />
      </div>
      <div className="md:col-span-5">
        <GuestDemographics customersByDomain={data.guestStats.customers_by_domain} />
      </div>

      <div className="md:col-span-12 space-y-6">
        <RevenueChart revenueData={data.revenueReport.data} />
      </div>

      <div className="md:col-span-12">
        <RecentBookings
          bookings={data.recentBookings.map((booking: any) => ({
            id: booking.id,
            guestName: booking.user?.name || "Guest",
            room: booking.rooms?.length
              ? booking.rooms.map((r: any) => r.room_number).join(", ")
              : "-",
            dates: `${booking.check_in} - ${booking.check_out}`,
            amount: new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(booking.total_price || 0)),
            status:
              booking.status === "confirmed"
                ? "Confirmed"
                : booking.status === "pending"
                  ? "Pending"
                  : "Canceled",
          }))}
        />
      </div>
    </div>
  );
}
