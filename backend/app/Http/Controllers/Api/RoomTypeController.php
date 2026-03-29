<?php

namespace App\Http\Controllers\Api;

use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends BaseController
{
    public function index()
    {
        return RoomType::with('amenities')->get();
    }

    public function show($id)
    {
        return RoomType::with('amenities')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        return RoomType::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $this->checkAdmin();

        $roomType = RoomType::findOrFail($id);
        $roomType->update($request->all());

        return $roomType;
    }

    public function destroy($id)
    {
        $this->checkAdmin();

        RoomType::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    public function syncAmenities(Request $request, $id)
    {
        $this->checkAdmin();

        $roomType = RoomType::findOrFail($id);
        $roomType->amenities()->sync($request->amenity_ids);

        return response()->json(['message' => 'Updated']);
    }

    public function uploadImage(Request $request, $id)
    {
        $this->checkAdmin();

        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $roomType = RoomType::findOrFail($id);

        $file = $request->file('image');
        $path = Storage::disk('public')->putFile('room-types', $file);

        // Ghi URL vào model và trả về URL đầy đủ
        $publicUrlRelative = Storage::url($path); // /storage/room-types/...
        $publicUrl = url($publicUrlRelative); // http://localhost:8000/storage/room-types/...

        $roomType->image_url = $publicUrlRelative;
        $roomType->save();

        return response()->json([
            'message' => 'Image uploaded',
            'image_url' => $publicUrl,
        ]);
    }
}