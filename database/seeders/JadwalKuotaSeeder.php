<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JadwalKuota;
use Carbon\Carbon;

class JadwalKuotaSeeder extends Seeder
{
    public function run(): void
    {
        // Set tanggal awal untuk estimasi PPDB tahun depan (Misal: 1 Juni 2027)
        $startDate = Carbon::create(2027, 6, 1);

        // Looping untuk 60 hari ke depan (Juni - Juli 2027)
        for ($i = 0; $i < 60; $i++) {
            $date = $startDate->copy()->addDays($i);

            // Lewati hari Minggu
            if ($date->dayOfWeek === Carbon::SUNDAY) {
                continue;
            }

            // Simpan ke database
            JadwalKuota::create([
                'tanggal' => $date->format('Y-m-d'),
                'kuota_maksimal' => 100, 
                'terisi' => 0,
                'status_buka' => true,
            ]);
        }
    }
}