<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AuthController extends Controller
{
    // =========================
    // REGISTER + GỬI OTP
    // =========================
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email:rfc,dns|unique:users',
            'password' => 'required|min:6',
        ]);

        User::create([
            'name' => $request->name,
            'email' => trim($request->email),
            'password' => Hash::make($request->password),
            'role' => 'customer',
            'is_verified' => true,
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công, bạn có thể đăng nhập'
        ]);
    }

    // =========================
    // VERIFY OTP
    // =========================
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'User không tồn tại'], 404);
        }

        if ($user->otp != $request->otp) {
            return response()->json(['error' => 'OTP sai'], 400);
        }

        if (now()->gt($user->otp_expires_at)) {
            return response()->json(['error' => 'OTP hết hạn'], 400);
        }

        $user->update([
            'is_verified' => true,
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        return response()->json([
            'message' => 'Xác thực thành công, bạn có thể đăng nhập'
        ]);
    }

    // =========================
    // LOGIN
    // =========================
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'User không tồn tại'], 404);
        }

        if (!$user->is_verified) {
            return response()->json([
                'error' => 'Email chưa xác thực'
            ], 403);
        }

        if (!$token = Auth::guard('api')->attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Sai mật khẩu'], 401);
        }

        return response()->json([
            'user' => Auth::guard('api')->user(),
            'token' => $token,
        ]);
    }

    // =========================
    // RESEND OTP
    // =========================
    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'User không tồn tại'], 404);
        }

        $otp = rand(100000, 999999);

        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(5),
        ]);

        Mail::raw("OTP mới của bạn là: $otp", function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Gửi lại OTP');
        });

        return response()->json([
            'message' => 'Đã gửi lại OTP'
        ]);
    }

    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Đăng xuất thành công'
        ]);
    }
}