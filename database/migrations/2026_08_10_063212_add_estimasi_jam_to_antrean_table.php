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
            if (!Schema::hasColumn('antrean', 'estimasi_jam')) {
                $table->string('estimasi_jam')->nullable()->after('nomor_urut');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('antrean', function (Blueprint $table) {
            if (Schema::hasColumn('antrean', 'estimasi_jam')) {
                $table->dropColumn('estimasi_jam');
            }
        });
    }
};
