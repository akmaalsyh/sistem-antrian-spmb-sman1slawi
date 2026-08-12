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
        Schema::table('antrean', function (Blueprint $table) {
            if (!Schema::hasColumn('antrean', 'alasan_batal')) {
                $table->text('alasan_batal')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('antrean', function (Blueprint $table) {
            if (Schema::hasColumn('antrean', 'alasan_batal')) {
                $table->dropColumn('alasan_batal');
            }
        });
    }
};
