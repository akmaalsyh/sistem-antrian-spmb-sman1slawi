<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PengaturanSistem;

class PengaturanSistemSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'durasi_menit_per_siswa',
                'value' => '10',
                'deskripsi' => 'Estimasi durasi waktu verifikasi berkas per siswa (Menit)',
                'tipe' => 'number',
            ],
            [
                'key' => 'jumlah_loket_aktif',
                'value' => '5',
                'deskripsi' => 'Jumlah Meja / Loket Verifikasi fisik yang beroperasi',
                'tipe' => 'number',
            ],
            [
                'key' => 'jam_operasional_mulai',
                'value' => '07:30',
                'deskripsi' => 'Jam dimulainya pelayanan verifikasi berkas di sekolah',
                'tipe' => 'time',
            ],
            [
                'key' => 'jam_operasional_selesai',
                'value' => '15:30',
                'deskripsi' => 'Jam berakhirnya pelayanan verifikasi berkas',
                'tipe' => 'time',
            ],
            [
                'key' => 'jam_isoma_mulai',
                'value' => '12:00',
                'deskripsi' => 'Jam mulai istirahat (ISOMA) petugas verifikasi',
                'tipe' => 'time',
            ],
            [
                'key' => 'jam_isoma_selesai',
                'value' => '13:00',
                'deskripsi' => 'Jam selesai istirahat (ISOMA) petugas verifikasi',
                'tipe' => 'time',
            ],
            [
                'key' => 'pesan_himbauan_siswa',
                'value' => 'Harap hadir 15 menit sebelum jam kedatangan tertera dan membawa berkas persyaratan fisik lengkap.',
                'deskripsi' => 'Teks pesan himbauan/petunjuk di E-Tiket Siswa',
                'tipe' => 'text',
            ],
            [
                'key' => 'nama_sekolah',
                'value' => 'SMA NEGERI 1 SLAWI',
                'deskripsi' => 'Nama Sekolah / Instansi Penyelenggara SPMB',
                'tipe' => 'text',
            ],
            [
                'key' => 'landing_hero_badge',
                'value' => '✨ Penerimaan Murid Baru Tahun Ajaran 2027 / 2028',
                'deskripsi' => 'Badge teks atas di hero landing page',
                'tipe' => 'text',
            ],
            [
                'key' => 'landing_hero_title',
                'value' => 'Sistem Penerimaan Murid Baru (SPMB)',
                'deskripsi' => 'Judul utama landing page',
                'tipe' => 'text',
            ],
            [
                'key' => 'landing_hero_subtitle',
                'value' => 'SMA Negeri 1 Slawi',
                'deskripsi' => 'Subjudul landing page',
                'tipe' => 'text',
            ],
            [
                'key' => 'landing_hero_desc',
                'value' => 'SMAN 1 Slawi resmi membuka pendaftaran secara daring melalui platform SPMB Jateng dengan mengedepankan prinsip transparan, akuntabel, dan bebas dari praktik titip maupun intervensi (No Titip, No Jastip).',
                'deskripsi' => 'Deskripsi hero landing page',
                'tipe' => 'text',
            ],
            [
                'key' => 'landing_hero_slogan',
                'value' => 'Berkarakter, Berprestasi, Unggul, Terdepan!',
                'deskripsi' => 'Slogan landing page',
                'tipe' => 'text',
            ],
        ];

        foreach ($settings as $s) {
            PengaturanSistem::updateOrCreate(
                ['key' => $s['key']],
                $s
            );
        }
    }
}
