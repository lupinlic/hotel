"use client";

import React, { useEffect, useState } from "react";
import { getDashboardRevenue } from "@/services/dashboardService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function RevenueReportPage() {
  const [report, setReport] = useState<{ period: string; start: string; end: string; data: { label: string; total_revenue: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardRevenue({ period: "month" });
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
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

  if (!report) {
    return <div className="p-4">No data</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Báo cáo doanh thu</h1>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 font-medium">Thời gian</th>
              <th className="px-4 py-2 font-medium">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {report.data.map((item) => (
              <tr key={item.label} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-2">{item.label}</td>
                <td className="px-4 py-2">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.total_revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}