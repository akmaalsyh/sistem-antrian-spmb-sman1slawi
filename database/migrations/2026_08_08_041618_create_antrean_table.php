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
        Schema::create('antrean', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('jadwal_id')->constrained('jadwal_kuota')->onDelete('cascade');
            $table->string('nomor_urut'); // Akan berisi format seperti A-001
            $table->enum('status', ['Menunggu', 'Dilayani', 'Selesai', 'Batal'])->default('Menunggu');
            $table->integer('dilayani_oleh_meja')->nullable(); // Boleh kosong saat baru ambil antrean
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('antrean');
    }
};