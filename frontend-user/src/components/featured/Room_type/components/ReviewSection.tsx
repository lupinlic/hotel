"use client";
import { useState } from "react";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { useMyBookings } from "@/hooks/useBookings";
import { useGetUser } from "@/hooks/useAuth";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

interface ReviewSectionProps {
  roomId: number;
}

export default function ReviewSection({ roomId }: ReviewSectionProps) {
  const { data: reviews, isLoading, error } = useReviews(roomId);
  const { data: user } = useGetUser();
  const { data: myBookings } = useMyBookings(!!user);
  const createReview = useCreateReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Filter reviews for this room type. Reviews store actual room id; fall back to room.room_type_id when available.
  const roomReviews = reviews?.filter(review => (
    // If backend returns nested room with room_type_id, match against that (room type page)
    (review.room && (review.room as any).room_type_id === roomId) ||
    // Otherwise match by room_id
    review.room_id === roomId
  )) || [];

  // Check if user has completed stay (or checked out) for this room
  const hasEligibleBooking = myBookings?.some(booking =>
    ['checked_out', 'completed'].includes(booking.status)
  );

  const canReview = user && hasEligibleBooking;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasEligibleBooking) return;

    // Find a completed or checked-out booking to use for review
    const bookingForReview = myBookings?.find(b => ['checked_out','completed'].includes(b.status));
    if (!bookingForReview) return;

    try {
      await createReview.mutateAsync({
        booking_id: bookingForReview.id,
        rating,
        comment: comment || undefined,
      });
      setComment("");
      setShowForm(false);
      toast.success("Đánh giá đã gửi thành công");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error?.message || "Gửi đánh giá thất bại");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Đánh giá từ khách hàng</h2>

      {/* Review Form */}
      {canReview ? (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Viết đánh giá của bạn</h3>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Viết đánh giá
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Đánh giá</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bình luận</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={createReview.isPending}
                >
                  {createReview.isPending ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="mb-8 p-6 border border-yellow-200 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            {!user 
              ? "Vui lòng đăng nhập để đánh giá phòng"
              : "Bạn cần có ít nhất một booking đã xác nhận để đánh giá"}
          </p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8">Đang tải đánh giá...</div>
      ) : roomReviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Chưa có đánh giá nào cho phòng này.</div>
      ) : (
        <div className="space-y-6">
          {roomReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{review.user.name}</div>
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('vi-VN')}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}