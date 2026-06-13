<?php

namespace App\Http\Controllers\Api;

use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class BookingController extends BaseController
{
    public function index()
    {
        $this->checkAdmin();

        return Booking::with('user', 'rooms')
            ->orderByRaw("FIELD(status, 'pending', 'confirmed', 'checked_in', 'checked_out', 'completed', 'cancelled', 'no_show')")
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function show($id)
    {
        $booking = Booking::with('rooms')->findOrFail($id);

        if ($booking->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        return $booking;
    }

    public function store(Request $request)
    {
        $user = Auth::guard('api')->user();

        return DB::transaction(function () use ($request, $user) {

            $room = Room::with('roomType')
                ->where('room_type_id', $request->room_type_id)
                ->whereDoesntHave('bookingRooms.booking', function ($q) use ($request) {
                    $q->where('status', '!=', 'cancelled')
                      ->where(function ($q) use ($request) {
                          $q->where('check_in', '<', $request->check_out)
                            ->where('check_out', '>', $request->check_in);
                      });
                })
                ->orderBy('id') // phòng trống ưu tiên đầu tiên
                ->lockForUpdate()
                ->first();

            if (!$room) {
                return response()->json(['error' => 'Đã hết phòng trong khoảng thời gian yêu cầu'], 400);
            }

            $booking = Booking::create([
                'user_id' => $user ? $user->id : null,
                'guest_name' => $request->guest_name,
                'guest_email' => $request->guest_email,
                'guest_phone' => $request->guest_phone,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'total_guests' => $request->total_guests,
                'total_price' => $request->total_price,
                'special_requests' => $request->special_requests,
                'status' => 'pending',
            ]);

            $booking->rooms()->attach($room->id);

            // Gửi email xác nhận đặt phòng
            if ($booking->guest_email) {
                $checkIn = Carbon::parse($booking->check_in)->format('d/m/Y');
                $checkOut = Carbon::parse($booking->check_out)->format('d/m/Y');
                $roomDisplay = $room->room_number ?? $room->name ?? 'Phòng chưa xác định';
                $roomTypeName = optional($room->roomType)->name ?? 'Phòng';

                $body = "Xin chào {$booking->guest_name},\n\n" .
                    "Đặt phòng của bạn đã được xác nhận. Dưới đây là thông tin:\n" .
                    "Phòng: {$roomDisplay} ({$roomTypeName})\n" .
                    "Check-in: {$checkIn}\n" .
                    "Check-out: {$checkOut}\n" .
                    "Số khách: {$booking->total_guests}\n" .
                    "Tổng tiền: " . number_format($booking->total_price, 0, ',', '.') . " đ\n\n" .
                    "Cảm ơn bạn đã đặt phòng tại hệ thống của chúng tôi.";

                Mail::raw($body, function ($message) use ($booking) {
                    $message->to($booking->guest_email)
                            ->subject('Xác nhận đặt phòng ');
                });
            }

            return $booking;
        });
    }

    public function myBookings()
    {
        return auth()->user()->bookings()
            ->with(['rooms.roomType', 'payment'])
            ->orderByRaw("FIELD(status, 'pending', 'confirmed', 'checked_in', 'checked_out', 'completed', 'cancelled', 'no_show')")
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function cancel($id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        $booking->update(['status' => 'cancelled']);

        return $booking;
    }

    public function confirm($id)
    {
        $this->checkAdmin();

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => 'confirmed']);

        return $booking;
    }

    public function adminCancel($id)
    {
        $this->checkAdmin();

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => 'cancelled']);

        return $booking;
    }

    public function checkIn($id)
    {
        $this->checkAdmin();

        $booking = Booking::findOrFail($id);
        if ($booking->status !== 'confirmed') {
            return response()->json(['error' => 'Booking must be confirmed before check-in'], 400);
        }

        $booking->update(['status' => 'checked_in']);

        return $booking;
    }

    public function checkOut($id)
    {
        $this->checkAdmin();

        $booking = Booking::findOrFail($id);
        if ($booking->status !== 'checked_in') {
            return response()->json(['error' => 'Booking must be checked in before check-out'], 400);
        }

        $booking->update(['status' => 'checked_out']);

        return $booking;
    }

    public function complete($id)
    {
        $this->checkAdmin();

        $booking = Booking::findOrFail($id);
        if ($booking->status !== 'checked_out') {
            return response()->json(['error' => 'Booking must be checked out before completion'], 400);
        }

        $booking->update(['status' => 'completed']);

        if ($payment = $booking->payment) {
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
            ]);
        }

        return $booking->load('payment');
    }

    public function noShow($id)
    {
        $this->checkAdmin();

        $booking = Booking::findOrFail($id);
        if ($booking->status !== 'confirmed') {
            return response()->json(['error' => 'Booking must be confirmed before no-show'], 400);
        }

        $booking->update(['status' => 'no_show']);

        return $booking;
    }

    public function revenueReport(Request $request)
    {
        $this->checkAdmin();

        $start = Carbon::parse($request->input('start', now()->subMonth()->startOfMonth()->toDateString()));
        $end = Carbon::parse($request->input('end', now()->endOfDay()->toDateString()));
        $period = $request->input('period', 'month'); // day|month|year

        $query = Booking::select(
            DB::raw("SUM(total_price) as total_revenue"),
            DB::raw(/**/ $this->revenueGroupSelect($period) /**/) 
        )
        ->where('status', 'completed')
        ->whereBetween('check_in', [$start->toDateString(), $end->toDateString()])
        ->groupBy(DB::raw($this->revenueGroupBy($period)))
        ->orderBy(DB::raw($this->revenueGroupBy($period)));

        $items = $query->get();

        return [
            'period' => $period,
            'start' => $start->toDateString(),
            'end' => $end->toDateString(),
            'data' => $items,
        ];
    }

    protected function revenueGroupSelect($period)
    {
        if ($period === 'day') {
            return "DATE(check_in) as label";
        } elseif ($period === 'year') {
            return "YEAR(check_in) as label";
        }

        return "DATE_FORMAT(check_in, '%Y-%m') as label";
    }

    protected function revenueGroupBy($period)
    {
        if ($period === 'day') {
            return "DATE(check_in)";
        } elseif ($period === 'year') {
            return "YEAR(check_in)";
        }

        return "DATE_FORMAT(check_in, '%Y-%m')";
    }

    public function occupancyReport(Request $request)
    {
        $this->checkAdmin();

        $start = Carbon::parse($request->input('start', now()->startOfMonth()));
        $end = Carbon::parse($request->input('end', now()->endOfMonth()));

        $days = $start->diffInDays($end) + 1;
        $roomCount = Room::count() ?: 1;
        $totalRoomNights = $roomCount * $days;

        $bookings = Booking::where('status', 'completed')
            ->where('check_in', '<=', $end->toDateString())
            ->where('check_out', '>=', $start->toDateString())
            ->get();

        $occupiedNights = 0;
        foreach ($bookings as $booking) {
            $checkIn = Carbon::parse($booking->check_in)->startOfDay();
            $checkOut = Carbon::parse($booking->check_out)->startOfDay();

            $overlapStart = $checkIn->gt($start) ? $checkIn : $start;
            $overlapEnd = $checkOut->lt($end) ? $checkOut : $end;

            if ($overlapEnd->gt($overlapStart)) {
                $occupiedNights += $overlapEnd->diffInDays($overlapStart);
            }
        }

        $occupancyRate = $totalRoomNights ? round(($occupiedNights / $totalRoomNights) * 100, 2) : 0;

        return [
            'start' => $start->toDateString(),
            'end' => $end->toDateString(),
            'room_count' => $roomCount,
            'total_room_nights' => $totalRoomNights,
            'occupied_nights' => $occupiedNights,
            'occupancy_rate' => $occupancyRate,
        ];
    }
}