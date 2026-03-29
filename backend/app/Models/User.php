<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// 🔥 thêm
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'otp',
    'otp_expires_at',
    'is_verified',
];
protected $casts = [
    'otp_expires_at' => 'datetime',
    'is_verified' => 'boolean',
];
    protected $hidden = [
        'password',
    ];

    // 🔗 bookings
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // 🔐 check role
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    // 🔗 reviews
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // =========================
    // 🔥 JWT bắt buộc
    // =========================

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}