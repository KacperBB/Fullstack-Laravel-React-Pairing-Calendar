<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();

            // Do którego eventu należy komentarz
            $table->foreignId('event_id')->constrained()->onDelete('cascade');

            // Kto napisał komentarz (autor)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Tekst komentarza (opcjonalny)
            $table->text('content')->nullable();

            // Ścieżka / URL do obrazka (opcjonalny)
            $table->string('image_path')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
