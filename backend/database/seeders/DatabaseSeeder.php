<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => Hash::make('123456'),
            'role' => 'customer',
            'is_verified' => true,
        ]);

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123456'), 
            'role' => 'admin',
            'is_verified' => 1,
        ]);
    }
}
