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
        Schema::create('autok', function (Blueprint $table) {
            $table->id("auto_id");
            $table->string("rendszam", 10);
            $table->string("tipus", 15);
            $table->string("marka", 15);
            $table->string("szin", 10);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('autok');
    }
};
