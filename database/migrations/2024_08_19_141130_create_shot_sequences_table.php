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
        Schema::create('sequence_shot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sequence_id')->constrained()->onDelete('cascade');
            $table->foreignId('shot_id')->constrained()->onDelete('cascade');
            $table->integer('order')->default(0); // Defines the order of shots in the sequence
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sequence_shot');
    }
};
