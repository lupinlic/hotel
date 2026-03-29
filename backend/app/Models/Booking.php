<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
    'user_id',

    'guest_name',
    'guest_email',
    'guest_phone',

    'check_in',
    'check_out',
    'total_guests',
    'total_price',
    'special_requests',
    'status',
];
   protected $casts = [
    'check_in' => 'date',
    'check_out' => 'date',
];

    // 🔗 user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔗 booking_rooms
    public function bookingRooms()
    {
        return $this->hasMany(BookingRoom::class);
    }

    // 🔗 rooms (through pivot)
    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'booking_rooms');
    }

    // 🔗 payment
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function isGuest()
    {
        return is_null($this->user_id);
    }
    public function getCustomerNameAttribute()
    {
        return $this->user
            ? $this->user->name
            : $this->guest_name;
    }
}
