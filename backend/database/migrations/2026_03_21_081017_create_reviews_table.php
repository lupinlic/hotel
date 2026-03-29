<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // Quan hệ
            $table->foreignId('room_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('booking_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Nội dung review
            $table->tinyInteger('rating')->unsigned(); // 1 -> 5
            $table->text('comment')->nullable();

            $table->timestamps();

            // Constraint quan trọng
            $table->unique('booking_id'); // mỗi booking chỉ 1 review

            // Index để query nhanh
            $table->index('room_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
