<?php

namespace App\Http\Controllers\Api;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends BaseController
{
    public function index()
    {
        return Room::with('roomType')->get();
    }

    public function show($id)
    {
        return Room::with('roomType')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        return Room::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $this->checkAdmin();

        $room = Room::findOrFail($id);
        $room->update($request->all());

        return $room;
    }

    public function destroy($id)
    {
        $this->checkAdmin();

        Room::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    // 🔥 search phòng trống
    public function search(Request $request)
    {
        return Room::whereDoesntHave('bookingRooms.booking', function ($q) use ($request) {
            $q->where('status', '!=', 'cancelled')
              ->where(function ($q) use ($request) {
                  $q->where('check_in', '<', $request->check_out)
                    ->where('check_out', '>', $request->check_in);
              });
        })->with('roomType')->get();
    }
}
