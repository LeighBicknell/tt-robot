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
        Schema::create('shots', function (Blueprint $table) {
            $table->id();
            $table->integer('topspin_min')->default(0);
            $table->integer('topspin_max')->default(100);
            $table->integer('backspin_min')->default(0);
            $table->integer('backspin_max')->default(100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shots');
    }
};
