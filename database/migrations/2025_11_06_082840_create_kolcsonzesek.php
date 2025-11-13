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
        Schema::create('kolcsonzesek', function (Blueprint $table) {
            $table->id("kolcsonzes_id");
            $table->foreignId('auto_id')->references('auto_id')->on('autok');
            $table->foreignId('ugyfel_id')->references('ugyfel_id')->on('ugyfelek');
            $table->dateTime("mikor_vitte");
            $table->dateTime("mikor_hozta");
            $table->integer("km_vitte");
            $table->integer("km_hozta");
            $table->decimal("napidij", 8, 2);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kolcsonzesek');
    }
};
