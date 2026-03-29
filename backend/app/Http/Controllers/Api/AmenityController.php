<?php

namespace App\Http\Controllers\Api;

use App\Models\Amenity;
use Illuminate\Http\Request;

class AmenityController extends BaseController
{
    public function index()
    {
        return Amenity::all();
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        return Amenity::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $this->checkAdmin();

        $amenity = Amenity::findOrFail($id);
        $amenity->update($request->all());

        return $amenity;
    }

    public function destroy($id)
    {
        $this->checkAdmin();

        Amenity::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
