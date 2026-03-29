<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Wifi, TV, Bathtub...
            $table->string('icon')->nullable(); // optional (frontend dùng)
            $table->string('type')->nullable(); // basic, luxury, view...
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};
