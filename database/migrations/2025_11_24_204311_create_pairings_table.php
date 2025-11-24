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
        Schema::create('pairings', function (Blueprint $table) {
            $table->id();

            // Uporządkowana para, żeby uniknąć duplikatów (1,2) i (2,1)
            $table->foreignId('user_a_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_b_id')->constrained('users')->onDelete('cascade');

            $table->timestamps();

            $table->unique(['user_a_id', 'user_b_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pairings');
    }
};
