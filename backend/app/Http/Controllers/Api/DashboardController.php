<?php

namespace App\Http\Controllers\Api;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends BaseController
{
    public function metrics()
    {
        $this->checkAdmin();

        $totalCustomers = User::where('role', 'customer')->count();
        $totalAdmins = User::where('role', 'admin')->count();

        $totalRooms = Room::count();
        $today = Carbon::today();

        $availableRooms = Room::whereDoesntHave('bookingRooms.booking', function ($q) use ($today) {
            $q->where('status', '!=', 'cancelled')
              ->where('check_in', '<=', $today)
              ->where('check_out', '>=', $today);
        })->count();

        $occupiedRooms = max(0, $totalRooms - $availableRooms);

        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $confirmedBookings = Booking::where('status', 'confirmed')->count();

        $totalRevenue = Payment::where('status', 'paid')
            ->whereHas('booking', function ($q) {
                $q->where('status', '!=', 'cancelled');
            })
            ->sum('amount');

        return [
            'customers' => [
                'total' => $totalCustomers,
                'admin' => $totalAdmins,
            ],
            'rooms' => [
                'total' => $totalRooms,
                'available' => $availableRooms,
                'occupied' => $occupiedRooms,
            ],
            'bookings' => [
                'total' => $totalBookings,
                'pending' => $pendingBookings,
                'confirmed' => $confirmedBookings,
            ],
            'revenue' => (float) $totalRevenue,
        ];
    }

    public function recentBookings()
    {
        $this->checkAdmin();

        return Booking::with('rooms', 'user')
            ->orderByRaw("FIELD(status, 'pending', 'confirmed', 'cancelled')")
            ->orderBy('created_at', 'desc')
            ->limit(7)
            ->get();
    }

    public function guestDemographics()
    {
        $this->checkAdmin();

        $guestByDomain = User::select(
            DB::raw("SUBSTRING_INDEX(email, '@', -1) as country"),
            DB::raw('COUNT(*) as total')
        )
        ->groupBy('country')
        ->orderBy('total', 'desc')
        ->limit(10)
        ->get();

        return [
            'customers_by_domain' => $guestByDomain,
            'top_customers' => User::withCount('bookings')->orderBy('bookings_count', 'desc')->limit(7)->get(['id', 'name', 'email', 'bookings_count']),
        ];
    }

    public function dashboardOccupancy(Request $request)
    {
        $this->checkAdmin();

        $start = Carbon::parse($request->input('start', now()->startOfMonth()));
        $end = Carbon::parse($request->input('end', now()->endOfMonth()));

        $roomCount = Room::count();
        $totalNights = $roomCount * ($start->diffInDays($end) + 1);

        $occupiedNights = Booking::where('status', 'confirmed')
            ->where('check_in', '<=', $end)
            ->where('check_out', '>=', $start)
            ->get()
            ->reduce(function ($carry, $booking) use ($start, $end) {
                $checkIn = Carbon::parse($booking->check_in)->max($start);
                $checkOut = Carbon::parse($booking->check_out)->min($end);

                if ($checkOut->lte($checkIn)) {
                    return $carry;
                }

                return $carry + $checkOut->diffInDays($checkIn);
            }, 0);

        $rate = $totalNights ? round(($occupiedNights / $totalNights) * 100, 2) : 0;

        return [
            'start' => $start->toDateString(),
            'end' => $end->toDateString(),
            'room_count' => $roomCount,
            'total_room_nights' => $totalNights,
            'occupied_nights' => $occupiedNights,
            'occupancy_rate' => $rate,
        ];
    }

    public function dashboardRevenue(Request $request)
    {
        $this->checkAdmin();

        $start = Carbon::parse($request->input('start', now()->subMonth()->startOfMonth()));
        $end = Carbon::parse($request->input('end', now()->endOfDay()));
        $period = $request->input('period', 'month');

        $groupSelect = $period === 'day'
            ? 'DATE(bookings.check_in) as label'
            : ($period === 'year'
                ? 'YEAR(bookings.check_in) as label'
                : "DATE_FORMAT(bookings.check_in, '%Y-%m') as label");

        $groupBy = $period === 'day'
            ? 'DATE(bookings.check_in)'
            : ($period === 'year'
                ? 'YEAR(bookings.check_in)'
                : "DATE_FORMAT(bookings.check_in, '%Y-%m')");

        $query = Payment::select(
            DB::raw('SUM(payments.amount) as total_revenue'),
            DB::raw($groupSelect)
        )
        ->join('bookings', 'payments.booking_id', '=', 'bookings.id')
        ->where('payments.status', 'paid')
        ->where('bookings.status', '!=', 'cancelled')
        ->whereBetween('bookings.check_in', [$start->toDateString(), $end->toDateString()])
        ->groupBy(DB::raw($groupBy))
        ->orderBy('label')
        ->get();

        return [
            'period' => $period,
            'start' => $start->toDateString(),
            'end' => $end->toDateString(),
            'data' => $query,
        ];
    }
}