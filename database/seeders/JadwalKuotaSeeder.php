<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JadwalKuota;
use Carbon\Carbon;

class JadwalKuotaSeeder extends Seeder
{
    public function run(): void
    {
        $startDate = Carbon::create(2027, 6, 1);

        for ($i = 0; $i < 60; $i++) {
            $date = $startDate->copy()->addDays($i);

            if ($date->isSunday()) {
                continue;
            }

            JadwalKuota::updateOrCreate(
                ['tanggal' => $date->format('Y-m-d')],
                [
                    'kuota_maksimal' => 100, 
                    'terisi' => 0,
                    'status_buka' => true,
                ]
            );
        }
    }
}