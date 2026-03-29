<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class RoomType extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
        'adult_capacity',
        'child_capacity',
        'bed_type',
        'bed_count',
        'image_url',
    ];

    public function getImageUrlAttribute($value)
    {
        if (empty($value)) {
            return null;
        }

        if (Str::startsWith($value, ['http://', 'https://'])) {
            return $value;
        }

        // Nếu lưu /storage/room-types/... hoặc room-types/... thì trả absolute URL
        if (Str::startsWith($value, '/')) {
            return url($value);
        }

        return url($value);
    }

    // 🔗 rooms
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    // 🔗 amenities
    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'room_type_amenities');
    }
}
