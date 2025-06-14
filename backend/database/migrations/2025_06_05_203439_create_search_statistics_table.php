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
        Schema::create('search_statistics', function (Blueprint $table) {
            $table->id();
            $table->string('query');
            $table->string('type'); // 'people' or 'movies'
            $table->integer('count')->default(1);
            $table->float('average_time')->default(0);
            $table->integer('hour_of_day');
            $table->timestamps();
            
            $table->unique(['query', 'type', 'hour_of_day']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('search_statistics');
    }
};
