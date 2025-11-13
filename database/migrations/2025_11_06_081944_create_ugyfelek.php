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
        Schema::create('ugyfelek', function (Blueprint $table) {
            $table->id("ugyfel_id");
            $table->string("szig", 10);
            $table->string("nev", 30);
            $table->string("email", 50);
            $table->string("telefonszam", 20);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ugyfelek');
    }
};
