<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends BaseController
{
    public function index()
    {
        return Review::with(['user', 'room', 'booking'])->get();
    }

    public function myReviews()
    {
        return Review::with(['room', 'booking'])
            ->where('user_id', auth()->id())
            ->get();
    }

    public function show($id)
    {
        return Review::with(['user', 'room', 'booking'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $user = Auth::guard('api')->user();

        if (!$user) {
            abort(401, 'Bạn phải đăng nhập để đánh giá');
        }

        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($request->booking_id);

        // Chỉ cho owner đặt phòng (user_id) review
        if (!$booking->user_id || $booking->user_id !== $user->id) {
            abort(403, 'Không có quyền đánh giá booking này');
        }

        if ($booking->review) {
            return response()->json(['error' => 'Đã đánh giá cho booking này'], 400);
        }

        $room = $booking->rooms()->first();
        $roomId = $room?->id;

        if (!$roomId) {
            abort(400, 'Không tìm thấy phòng để đánh giá');
        }

        $review = Review::create([
            'room_id' => $roomId,
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return $review;
    }

    public function destroy($id)
    {
        $this->checkAdmin();

        Review::destroy($id);

        return response()->json(['message' => 'Review deleted']);
    }
}
