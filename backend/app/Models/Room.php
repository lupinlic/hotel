<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'room_type_id',
        'status',
    ];

    // 🔗 room type
    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    // 🔗 booking_rooms
    public function bookingRooms()
    {
        return $this->hasMany(BookingRoom::class);
    }

    // 🔗 reviews
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}