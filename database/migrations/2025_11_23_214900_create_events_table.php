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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');                       //dzień zdarzenia
            $table->time('start_time');                 //godzina rozpoczęcia
            $table->time('end_time');                   //godzina zakończenia
            $table->string('title');                    //tytuł zdarzenia
            $table->string('color')->nullable();        //kolor zdarzenia
            $table->string('icon')->nullable();         //ikona zdarzenia
            $table->text('note')->nullable();           //notatka do zdarzenia
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
