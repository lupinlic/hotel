<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoomTypeController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']); 
    Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| PUBLIC (KHÔNG CẦN LOGIN)
|--------------------------------------------------------------------------
*/

// xem dữ liệu
Route::get('/room-types', [RoomTypeController::class, 'index']);
Route::get('/room-types/{id}', [RoomTypeController::class, 'show']);

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);

Route::get('/amenities', [AmenityController::class, 'index']);
Route::get('/search', [RoomController::class, 'search']);
Route::get('/reviews', [ReviewController::class, 'index']);

// 👉 QUAN TRỌNG: guest vẫn đặt được
Route::post('/bookings', [BookingController::class, 'store']);
Route::post('/payments', [PaymentController::class, 'store']);

/*
|--------------------------------------------------------------------------
| USER (CẦN LOGIN)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store']);

    // 👤 Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 📦 booking của user
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // 💳 payment
    Route::get('/payments/{id}', [PaymentController::class, 'show']);

    // 🧾 user own reviews
    Route::get('/my-reviews', [ReviewController::class, 'myReviews']);
});
/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api'])->prefix('admin')->group(function () {

    /*
    | USER MANAGEMENT
    */
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    /*
    | REVIEWS
    */
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/{id}', [ReviewController::class, 'show']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    /*
    | ROOM TYPES
    */
    Route::post('/room-types', [RoomTypeController::class, 'store']);
    Route::put('/room-types/{id}', [RoomTypeController::class, 'update']);
    Route::delete('/room-types/{id}', [RoomTypeController::class, 'destroy']);

    /*
    | ROOMS
    */
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{id}', [RoomController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

    /*
    | AMENITIES
    */
    Route::post('/amenities', [AmenityController::class, 'store']);
    Route::put('/amenities/{id}', [AmenityController::class, 'update']);
    Route::delete('/amenities/{id}', [AmenityController::class, 'destroy']);

    /*
    | GÁN TIỆN NGHI
    */
    Route::post('/room-types/{id}/amenities', [RoomTypeController::class, 'syncAmenities']);
    Route::post('/room-types/{id}/upload-image', [RoomTypeController::class, 'uploadImage']);

    /*
    | BOOKINGS (admin)
    */
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::put('/bookings/{id}/confirm', [BookingController::class, 'confirm']);
    Route::put('/bookings/{id}/check-in', [BookingController::class, 'checkIn']);
    Route::put('/bookings/{id}/check-out', [BookingController::class, 'checkOut']);
    Route::put('/bookings/{id}/complete', [BookingController::class, 'complete']);
    Route::put('/bookings/{id}/no-show', [BookingController::class, 'noShow']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'adminCancel']);

    /*
    | PAYMENTS (admin)
    */
    Route::get('/payments', [PaymentController::class, 'index']);

    /*
    | REPORTS (admin) - legacy
    */
    Route::get('/reports/revenue', [BookingController::class, 'revenueReport']);
    Route::get('/reports/occupancy', [BookingController::class, 'occupancyReport']);

    /*
    | DASHBOARD (admin)
    */
    Route::get('/dashboard/metrics', [DashboardController::class, 'metrics']);
    Route::get('/dashboard/revenue', [DashboardController::class, 'dashboardRevenue']);
    Route::get('/dashboard/occupancy', [DashboardController::class, 'dashboardOccupancy']);
    Route::get('/dashboard/guest-demographics', [DashboardController::class, 'guestDemographics']);
    Route::get('/dashboard/recent-bookings', [DashboardController::class, 'recentBookings']);
    Route::get('/dashboard/top-rooms-booked', [DashboardController::class, 'topRoomsBooked']);
});