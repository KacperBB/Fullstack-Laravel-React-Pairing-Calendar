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
        Schema::create('pairing_codes', function (Blueprint $table) {
            $table->id();

            // właściel kodu
            $table -> foreignId('user_id')->constrained()->onDelete('cascade');

            // sam kod, np. 8 znaków
            $table-> string('code',16)->unique();

            //data ważności
            $table->timestamp('expires_at')->nullable();

            //kiedy został wykorzystany
            $table -> timestamp('used_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pairing_codes');
    }
};
