<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'type',
    ];

    public function roomTypes()
    {
        return $this->belongsToMany(RoomType::class, 'room_type_amenities');
    }
}