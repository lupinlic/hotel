"use client";

import React, { useEffect, useState } from "react";
import { getDashboardOccupancy } from "@/services/dashboardService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function OccupancyReportPage() {
  const [occupancy, setOccupancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOccupancy = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardOccupancy();
        setOccupancy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    loadOccupancy();
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

  if (!occupancy) {
    return <div className="p-4">No data</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Báo cáo tình trạng sử dụng</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p>Thời gian: {occupancy.start} - {occupancy.end}</p>
        <p>Phòng tổng: {occupancy.room_count}</p>
        <p>Tổng đêm khả dụng: {occupancy.total_room_nights}</p>
        <p>Đêm đã đặt: {occupancy.occupied_nights}</p>
        <p>Tỷ lệ lấp đầy: {occupancy.occupancy_rate}%</p>
      </div>
    </div>
  );
}