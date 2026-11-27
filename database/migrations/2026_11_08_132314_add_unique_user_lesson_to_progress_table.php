<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A student has at most one progress row per lesson, so repeating a lesson
     * can never be counted twice.
     */
    public function up(): void
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->unique(['user_id', 'lesson_id']);
        });
    }

    public function down(): void
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'lesson_id']);
        });
    }
};
