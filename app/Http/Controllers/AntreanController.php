<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JadwalKuota;
use App\Models\Antrean;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AntreanController extends Controller
{
    /**
     * Hitung Estimasi Jam Kedatangan secara Dinamis berdasarkan Pengaturan Sistem Admin
     */
    private function hitungEstimasiJam($urutanIndeks)
    {
        $jumlahLoket = (int) \App\Models\PengaturanSistem::get('jumlah_loket_aktif', 5);
        $durasiMenitPerSiswa = (int) \App\Models\PengaturanSistem::get('durasi_menit_per_siswa', 10);
        $jamMulaiStr = \App\Models\PengaturanSistem::get('jam_operasional_mulai', '07:30');
        
        $jumlahLoket = max(1, $jumlahLoket);
        
        // Menghitung gelombang/batch keberangkatan
        $batch = floor($urutanIndeks / $jumlahLoket);
        $tambahanMenit = $batch * $durasiMenitPerSiswa;

        // Mulai Jam Operasional dari Setting
        $parts = explode(':', $jamMulaiStr);
        $hour = isset($parts[0]) ? (int)$parts[0] : 7;
        $minute = isset($parts[1]) ? (int)$parts[1] : 30;

        $jamEstimasi = Carbon::createFromTime($hour, $minute, 0)->addMinutes($tambahanMenit);

        // Jika melewati jam 12:00 (ISOMA), tambah 60 menit
        if (($jamEstimasi->hour == 12 && $jamEstimasi->minute > 0) || $jamEstimasi->hour > 12) {
            $jamEstimasi->addHour();
        }

        return $jamEstimasi->format('H:i');
    }

    // Halaman depan Landing Page
    public function index()
    {
        $landingSettings = [
            'site_title' => \App\Models\PengaturanSistem::get('landing_site_title', 'Portal Resmi SPMB'),
            'header_subtitle' => \App\Models\PengaturanSistem::get('landing_header_subtitle', 'PORTAL RESMI SPMB'),
            'hero_badge' => \App\Models\PengaturanSistem::get('landing_hero_badge', '✨ Penerimaan Murid Baru SMAN 1 Slawi'),
            'hero_title' => \App\Models\PengaturanSistem::get('landing_hero_title', 'Sistem Penerimaan Murid Baru (SPMB)'),
            'hero_subtitle' => \App\Models\PengaturanSistem::get('landing_hero_subtitle', 'SMA Negeri 1 Slawi'),
            'hero_desc' => \App\Models\PengaturanSistem::get('landing_hero_desc', 'SMAN 1 Slawi resmi membuka pendaftaran secara daring melalui platform SPMB Jateng dengan mengedepankan prinsip transparan, akuntabel, dan bebas dari praktik titip maupun intervensi (No Titip, No Jastip).'),
            'hero_slogan' => \App\Models\PengaturanSistem::get('landing_hero_slogan', 'Berkarakter, Berprestasi, Unggul, Terdepan!'),
            
            'linimasa' => json_decode(\App\Models\PengaturanSistem::get('landing_linimasa', ''), true) ?: [
                ['tahap' => '1', 'tanggal' => '18 Mei 2027', 'agenda' => 'Pengumuman SPMB', 'desc' => 'Pengumuman resmi juknis & syarat SPMB SMAN 1 Slawi.'],
                ['tahap' => '2', 'tanggal' => '3–12 Juni 2027', 'agenda' => 'Pengajuan Akun', 'desc' => 'Pembuatan & pengajuan akun calon murid baru secara online.'],
                ['tahap' => '3', 'tanggal' => '4–13 Juni 2027', 'agenda' => 'Verifikasi Berkas', 'desc' => 'Verifikasi berkas fisik dan aktivasi akun pendaftaran.'],
                ['tahap' => '4', 'tanggal' => '14 Juni 2027', 'agenda' => 'Sinkronisasi Data', 'desc' => 'Validasi dan penguncian data pendaftar secara otomatis.'],
                ['tahap' => '5', 'tanggal' => '15–18 Juni 2027', 'agenda' => 'Pendaftaran Online', 'desc' => 'Pemilihan jalur & pilihan sekolah SMA tujuan pendaftaran.'],
                ['tahap' => '6', 'tanggal' => '19–20 Juni 2027', 'agenda' => 'Evaluasi & Masa Tenang', 'desc' => 'Pemeringkatan jurnal seleksi dan penutupan perubahan.'],
                ['tahap' => '7', 'tanggal' => '21 Juni 2027', 'agenda' => 'Pengumuman Utama', 'desc' => 'Pengumuman resmi calon siswa yang lolos seleksi utama.'],
                ['tahap' => '8', 'tanggal' => '22–25 Juni 2027', 'agenda' => 'Daftar Ulang Utama', 'desc' => 'Registrasi ulang berkas fisik bagi peserta kelulusan utama.'],
                ['tahap' => '9', 'tanggal' => '26 Juni 2027', 'agenda' => 'Pengumuman Cadangan', 'desc' => 'Pengumuman kuota tersisa dan daftar peserta cadangan.'],
                ['tahap' => '10', 'tanggal' => '29–30 Juni 2027', 'agenda' => 'Daftar Ulang Cadangan', 'desc' => 'Daftar ulang bagi peserta didik status cadangan.'],
                ['tahap' => '11', 'tanggal' => '15 Juli 2027', 'agenda' => 'Awal Tahun Ajaran Baru', 'desc' => 'Hari pertama masuk sekolah dan pembukaan MPLS.'],
            ],

            'jalurSeleksi' => json_decode(\App\Models\PengaturanSistem::get('landing_jalur_seleksi', ''), true) ?: [
                ['nama' => '1. Jalur Domisili', 'kuota' => 'Paling sedikit 33%', 'desc' => 'Berdasarkan jarak domisili tempat tinggal terdekat dengan lokasi SMAN 1 Slawi.', 'badgeBg' => 'bg-blue-600'],
                ['nama' => '2. Jalur Afirmasi', 'kuota' => 'Paling sedikit 32%', 'desc' => 'Peruntukan khusus bagi: Penyandang Disabilitas (maks. 2%), Keluarga Ekonomi Tidak Mampu, Anak Panti (maks. 3%), dan ATS / Anak Putus Sekolah (maks. 2%).', 'badgeBg' => 'bg-emerald-600'],
                ['nama' => '3. Jalur Prestasi', 'kuota' => 'Paling sedikit 30%', 'desc' => 'Penilaian berdasarkan akumulasi Prestasi Akademik, Prestasi Non-Akademik, serta Keaktifan Pengurus / Ketua Organisasi.', 'badgeBg' => 'bg-purple-600'],
                ['nama' => '4. Jalur Mutasi', 'kuota' => 'Paling banyak 5%', 'desc' => 'Perpindahan tugas orang tua/wali dari luar daerah, termasuk di dalamnya khusus untuk anak guru.', 'badgeBg' => 'bg-amber-600'],
            ],

            'dokumenReq' => json_decode(\App\Models\PengaturanSistem::get('landing_dokumen_req', ''), true) ?: [
                'Kartu Keluarga (Asli + Fotokopi)',
                'Surat Keterangan Rapor Semester 1–5 (Asli)',
                'Akta Kelahiran (Asli + Fotokopi)',
                'Surat Keterangan Lulus (Asli)',
                'Buku Rapor (Asli)',
                'Sertifikat Hasil TKA (Asli)',
                'Sertifikat Prestasi (jika memiliki)',
            ],

            'mapelPenilaian' => json_decode(\App\Models\PengaturanSistem::get('landing_mapel_penilaian', ''), true) ?: [
                'Pendidikan Agama & Budi Pekerti',
                'PPKn',
                'Bahasa Indonesia',
                'Matematika',
                'IPA',
                'IPS',
                'Bahasa Inggris',
            ],

            'linktree_url' => \App\Models\PengaturanSistem::get('landing_linktree_url', 'https://linktr.ee/SPMB25_SMANSAWI'),
            'wa_group_url' => \App\Models\PengaturanSistem::get('landing_wa_group_url', 'https://chat.whatsapp.com/HzexyMQc1w4GxjHj1H2weH'),

            'narahubung' => json_decode(\App\Models\PengaturanSistem::get('landing_narahubung', ''), true) ?: [
                ['nama' => 'Lulus Wijayanto, S.Pd', 'telp' => '0815-7517-5363'],
                ['nama' => 'Rusmawati, S.Pd', 'telp' => '0856-4088-2285'],
                ['nama' => 'Afgriz Prasetiyawati, S.Pd', 'telp' => '0812-2503-0765'],
                ['nama' => 'Dyah Ayu Triana, S.Si', 'telp' => '0852-2634-7402'],
            ],

            'alamat' => \App\Models\PengaturanSistem::get('landing_alamat', 'Jl. Kh Wahid Hasyim No.1, Kalijembangan, Pakembaran, Kec. Slawi, Kabupaten Tegal, Jawa Tengah 52415'),
            'website_url' => \App\Models\PengaturanSistem::get('landing_website_url', 'https://sman1slawi.sch.id'),
            'instagram_url' => \App\Models\PengaturanSistem::get('landing_instagram_url', 'https://instagram.com/smansawi_official'),
            'youtube_url' => \App\Models\PengaturanSistem::get('landing_youtube_url', 'https://www.youtube.com/@sman1slawi'),
            'footer_desc' => (function() {
                $desc = \App\Models\PengaturanSistem::get('landing_footer_desc', '');
                if (empty($desc) || $desc === 'Portal Resmi Sistem Penerimaan Murid Baru (SPMB) SMA Negeri 1 Slawi.') {
                    return 'Sistem Antrean & Informasi SPMB SMAN 1 Slawi ini merupakan hasil karya pengabdian masyarakat dari Kelompok KKN Sahabat Sekolah Jawa Tengah 001 Universitas Muhammadiyah Yogyakarta Periode Genap 2025/2026';
                }
                return $desc;
            })(),
            'footer_copyright' => (function() {
                $copy = \App\Models\PengaturanSistem::get('landing_footer_copyright', '');
                if (empty($copy) || $copy === '© 2026 SMAN 1 Slawi. Seluruh Hak Cipta Dilindungi.') {
                    return '© 2026 SMAN 1 Slawi • Panitia SPMB dan KKN Sahabat Sekolah Jateng 001 UMY. All Rights Reserved.';
                }
                return $copy;
            })(),
            'tabs' => (function() {
                $raw = \App\Models\PengaturanSistem::get('landing_tabs', null);
                if (!is_null($raw) && $raw !== '') {
                    return json_decode($raw, true) ?: [];
                }
                return [
                    ['id' => 'hero', 'label' => '1. Banner Hero Utama', 'icon' => '🚀', 'deletable' => false],
                    ['id' => 'linimasa', 'label' => '2. Alur Linimasa (Timeline)', 'icon' => '📅', 'deletable' => false],
                    ['id' => 'jalur', 'label' => '3. Jalur Seleksi & Kuota', 'icon' => '🎯', 'deletable' => false],
                    ['id' => 'berkas', 'label' => '4. Syarat Berkas & Mapel', 'icon' => '📄', 'deletable' => false],
                    ['id' => 'kontak', 'label' => '5. Link & Narahubung', 'icon' => '📞', 'deletable' => false],
                    ['id' => 'sosmed', 'label' => '6. Alamat & Media Sosial', 'icon' => '🌐', 'deletable' => false],
                ];
            })(),
        ];

        return Inertia::render('Welcome', [
            'landingSettings' => $landingSettings,
        ]);
    }

    // Halaman Dashboard Siswa
    public function dashboard()
    {
        $user = Auth::user();

        // 1. Cek antrean siswa (termasuk status 'Menunggu', 'Dilayani', maupun 'Selesai')
        $antreanSiswa = Antrean::with('jadwal')
            ->where('user_id', $user->id)
            ->whereIn('status', ['Menunggu', 'Dilayani', 'Selesai'])
            ->latest('updated_at')
            ->first();

        // Regenerasi jam kedatangan agar formatnya jam mulai saja (misal: 07:30 WIB)
        if ($antreanSiswa) {
            $urutanSebelumnya = Antrean::where('jadwal_id', $antreanSiswa->jadwal_id)
                ->where('id', '<', $antreanSiswa->id)
                ->count();

            $estimasiJam = $this->hitungEstimasiJam($urutanSebelumnya);
            if ($antreanSiswa->estimasi_jam !== $estimasiJam) {
                Antrean::where('id', $antreanSiswa->id)->update(['estimasi_jam' => $estimasiJam]);
                $antreanSiswa->estimasi_jam = $estimasiJam;
            }
        }

        // 2. Ambil daftar seluruh jadwal kuota yang dibuka
        $jadwalTersedia = JadwalKuota::where('status_buka', true)
            ->orderBy('tanggal', 'asc')
            ->get();

        $pesanHimbauan = \App\Models\PengaturanSistem::get('pesan_himbauan_siswa', 'Harap hadir 15 menit sebelum jam kedatangan tertera dan membawa berkas persyaratan fisik lengkap.');

        return Inertia::render('Siswa/Etiket', [
            'antreanSiswa' => $antreanSiswa,
            'jadwalTersedia' => $jadwalTersedia,
            'pesanHimbauan' => $pesanHimbauan,
        ]);
    }

    // Halaman Cek Berkas Persyaratan Siswa
    public function cekBerkas()
    {
        return Inertia::render('Siswa/CekBerkas');
    }

    // Ambil Antrean Baru
    public function ambilAntrean(Request $request)
    {
        $request->validate([
            'jadwal_id' => 'required|exists:jadwal_kuota,id',
        ]);

        $user = Auth::user();

        return DB::transaction(function () use ($request, $user) {
            $existing = Antrean::where('user_id', $user->id)
                ->whereIn('status', ['Menunggu', 'Dilayani', 'Selesai'])
                ->first();

            if ($existing) {
                return redirect()->back()->withErrors([
                    'error' => 'Anda telah menyelesaikan atau memiliki tiket antrean. Tidak dapat mendaftar kembali.'
                ]);
            }

            $jadwal = JadwalKuota::lockForUpdate()->find($request->jadwal_id);

            if (!$jadwal || !$jadwal->status_buka) {
                return redirect()->back()->withErrors([
                    'error' => 'Jadwal kuota ini tidak tersedia atau sudah ditutup.'
                ]);
            }

            if ($jadwal->terisi >= $jadwal->kuota_maksimal) {
                return redirect()->back()->withErrors([
                    'error' => 'Maaf, kuota antrean untuk tanggal ini sudah penuh.'
                ]);
            }

            $totalAntreanDiJadwal = Antrean::where('jadwal_id', $jadwal->id)->count();
            $countUrutan = $totalAntreanDiJadwal + 1;
            $nomorUrut = 'A-' . str_pad($countUrutan, 3, '0', STR_PAD_LEFT);

            // Hitung jam kedatangan (Contoh: 07:30 WIB)
            $estimasiJam = $this->hitungEstimasiJam($totalAntreanDiJadwal);

            Antrean::create([
                'user_id' => $user->id,
                'jadwal_id' => $jadwal->id,
                'nomor_urut' => $nomorUrut,
                'estimasi_jam' => $estimasiJam,
                'status' => 'Menunggu',
            ]);

            $jadwal->increment('terisi');

            return redirect()->route('siswa.etiket')->with('success', 'Nomor antrean berhasil diambil!');
        });
    }

    // Pembatalan Antrean Siswa
    public function batalAntrean(Request $request)
    {
        $request->validate([
            'antrean_id' => 'required|exists:antrean,id',
            'alasan_batal' => 'required|string|max:255',
        ], [
            'alasan_batal.required' => 'Mohon pilih atau tuliskan alasan pembatalan antrean.',
        ]);

        $user = Auth::user();

        return DB::transaction(function () use ($request, $user) {
            $antrean = Antrean::where('id', $request->antrean_id)
                ->where('user_id', $user->id)
                ->where('status', 'Menunggu')
                ->first();

            if (!$antrean) {
                return redirect()->back()->withErrors([
                    'error' => 'Antrean tidak ditemukan atau sudah tidak dapat dibatalkan.'
                ]);
            }

            $antrean->update([
                'status' => 'Batal',
                'alasan_batal' => $request->alasan_batal,
            ]);

            $jadwal = JadwalKuota::find($antrean->jadwal_id);
            if ($jadwal && $jadwal->terisi > 0) {
                $jadwal->decrement('terisi');
            }

            return redirect()->route('siswa.etiket')->with('status', 'Tiket antrean berhasil dibatalkan. Kuota harian telah dikembalikan.');
        });
    }
}