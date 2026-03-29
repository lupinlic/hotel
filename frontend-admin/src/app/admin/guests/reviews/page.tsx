"use client";

import React, { useEffect, useState } from "react";
import { getReviews, ReviewDto } from "@/services/reviewService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GuestsReviewPage() {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Đánh giá khách hàng</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-100">
              {item.user?.name || "Khách"} - {item.room?.room_number || "Phòng"}
            </div>
            <div className="mb-1 text-orange-500">
              Đánh giá: {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.comment}</p>
            <p className="mt-3 text-xs text-gray-400">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
