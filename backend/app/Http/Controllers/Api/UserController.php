<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    public function index()
    {
        $this->checkAdmin();

        return User::select('id', 'name', 'email', 'role', 'is_verified', 'created_at')->get();
    }

    public function show($id)
    {
        $this->checkAdmin();

        return User::select('id', 'name', 'email', 'role', 'is_verified', 'created_at')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $this->checkAdmin();

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'role' => 'sometimes|in:customer,admin',
            'is_verified' => 'sometimes|boolean',
        ]);

        $user->update($request->only(['name', 'role', 'is_verified']));

        return $user;
    }

    public function destroy($id)
    {
        $this->checkAdmin();

        User::destroy($id);

        return response()->json(['message' => 'User deleted']);
    }
}
