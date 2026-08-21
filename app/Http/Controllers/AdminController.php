<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Antrean;
use App\Models\JadwalKuota;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Dashboard Utama Admin & Realtime Overview
     */
    public function dashboard(Request $request)
    {
        $totalSiswa = User::where('role', 'siswa')->count();
        $totalGuru = User::where('role', 'guru')->count();

        $selectedTanggal = $request->input('tanggal', Carbon::today()->format('Y-m-d'));
        
        $totalAntreanHariIni = Antrean::whereHas('jadwal', function ($q) use ($selectedTanggal) {
            $q->where('tanggal', $selectedTanggal);
        })->count();

        $antreanSelesaiHariIni = Antrean::whereHas('jadwal', function ($q) use ($selectedTanggal) {
            $q->where('tanggal', $selectedTanggal);
        })->where('status', 'Selesai')->count();

        $antreanDilayaniHariIni = Antrean::whereHas('jadwal', function ($q) use ($selectedTanggal) {
            $q->where('tanggal', $selectedTanggal);
        })->where('status', 'Dilayani')->count();

        $antreanMenungguHariIni = Antrean::whereHas('jadwal', function ($q) use ($selectedTanggal) {
            $q->where('tanggal', $selectedTanggal);
        })->where('status', 'Menunggu')->count();

        // 5 Antrean Terakhir Dilayani
        $antreanTerakhir = Antrean::with(['user', 'jadwal'])
            ->whereHas('jadwal', function ($q) use ($selectedTanggal) {
                $q->where('tanggal', $selectedTanggal);
            })
            ->whereIn('status', ['Dilayani', 'Selesai'])
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        // Jadwal Kuota Hari Ini / Tanggal Terpilih
        $jadwalHariIni = JadwalKuota::where('tanggal', $selectedTanggal)->first();

        return Inertia::render('Admin/Dashboard', [
            'selectedTanggal' => $selectedTanggal,
            'statistik' => [
                'totalSiswa' => $totalSiswa,
                'totalGuru' => $totalGuru,
                'totalAntreanHariIni' => $totalAntreanHariIni,
                'antreanSelesaiHariIni' => $antreanSelesaiHariIni,
                'antreanDilayaniHariIni' => $antreanDilayaniHariIni,
                'antreanMenungguHariIni' => $antreanMenungguHariIni,
            ],
            'jadwalHariIni' => $jadwalHariIni,
            'antreanTerakhir' => $antreanTerakhir,
        ]);
    }

    /**
     * Halaman Kelola Jadwal & Kuota Harian
     */
    public function kelolaJadwal()
    {
        $jadwals = JadwalKuota::withCount('antrean')
            ->orderBy('tanggal', 'asc')
            ->get();

        return Inertia::render('Admin/Jadwal', [
            'jadwals' => $jadwals,
        ]);
    }

    /**
     * Tambah/Buka Tanggal Kuota Baru
     */
    public function simpanJadwal(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date|unique:jadwal_kuota,tanggal',
            'kuota_maksimal' => 'required|integer|min:1',
            'status_buka' => 'required|boolean',
        ]);

        JadwalKuota::create([
            'tanggal' => $request->tanggal,
            'kuota_maksimal' => $request->kuota_maksimal,
            'sisa_kuota' => $request->kuota_maksimal,
            'status_buka' => $request->status_buka,
        ]);

        return redirect()->back()->with('status', 'Jadwal kuota baru berhasil ditambahkan');
    }

    /**
     * Update Kuota / Status Buka-Tutup Tanggal
     */
    public function updateJadwal(Request $request, $id)
    {
        $request->validate([
            'kuota_maksimal' => 'required|integer|min:1',
            'status_buka' => 'required|boolean',
        ]);

        $jadwal = JadwalKuota::findOrFail($id);
        $terpakai = Antrean::where('jadwal_id', $jadwal->id)->count();

        $sisaKuota = max(0, $request->kuota_maksimal - $terpakai);

        $jadwal->update([
            'kuota_maksimal' => $request->kuota_maksimal,
            'sisa_kuota' => $sisaKuota,
            'status_buka' => $request->status_buka,
        ]);

        return redirect()->back()->with('status', 'Jadwal kuota berhasil diperbarui');
    }

    /**
     * Hapus Tanggal Kuota
     */
    public function hapusJadwal($id)
    {
        $jadwal = JadwalKuota::findOrFail($id);
        
        if ($jadwal->antrean()->count() > 0) {
            return redirect()->back()->withErrors([
                'error' => 'Tidak dapat menghapus jadwal yang sudah memiliki antrean terdaftar.'
            ]);
        }

        $jadwal->delete();
        return redirect()->back()->with('status', 'Jadwal kuota berhasil dihapus');
    }

    /**
     * Halaman Kelola Pengguna (User Management - Guru & Siswa)
     */
    public function kelolaUser()
    {
        $gurus = User::where('role', 'guru')->orderBy('name', 'asc')->get();
        $siswas = User::where('role', 'siswa')->orderBy('created_at', 'desc')->take(50)->get();

        return Inertia::render('Admin/UserManagement', [
            'gurus' => $gurus,
            'siswas' => $siswas,
        ]);
    }

    /**
     * Tambah Akun Guru Baru
     */
    public function simpanGuru(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nisn' => 'required|string|unique:users,nisn',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name' => $request->name,
            'nisn' => $request->nisn,
            'role' => 'guru',
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()->with('status', 'Akun Guru / Verifikator berhasil dibuat.');
    }

    /**
     * Tambah Akun Siswa Baru
     */
    public function simpanSiswa(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nisn' => 'required|string|unique:users,nisn',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name' => $request->name,
            'nisn' => $request->nisn,
            'role' => 'siswa',
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()->with('status', 'Akun Siswa (' . $request->nisn . ') berhasil dibuat.');
    }

    /**
     * Reset Password User (Guru/Siswa)
     */
    public function resetPassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()->with('status', 'Password akun ' . $user->name . ' berhasil direset');
    }

    /**
     * Hapus User
     */
    public function hapusUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return redirect()->back()->withErrors(['error' => 'Akun Administrator utama tidak dapat dihapus.']);
        }

        $user->delete();
        return redirect()->back()->with('status', 'Akun pengguna berhasil dihapus');
    }

    /**
     * Halaman Laporan & Rekapitulasi Data Antrean
     */
    public function laporan(Request $request)
    {
        $selectedTanggal = $request->input('tanggal', Carbon::today()->format('Y-m-d'));

        $antreans = Antrean::with(['user', 'jadwal'])
            ->whereHas('jadwal', function ($q) use ($selectedTanggal) {
                $q->where('tanggal', $selectedTanggal);
            })
            ->orderBy('nomor_urut', 'asc')
            ->get();

        $daftarTanggal = JadwalKuota::orderBy('tanggal', 'desc')->get();

        return Inertia::render('Admin/Laporan', [
            'antreans' => $antreans,
            'selectedTanggal' => $selectedTanggal,
            'daftarTanggal' => $daftarTanggal,
        ]);
    }

    /**
     * Halaman Kelola Pengaturan Sistem (Durasi, Loket, Jam Operasional)
     */
    public function kelolaPengaturan()
    {
        $settings = \App\Models\PengaturanSistem::all();

        return Inertia::render('Admin/Pengaturan', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update Pengaturan Sistem oleh Admin
     */
    public function simpanPengaturan(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            \App\Models\PengaturanSistem::set($key, $value);
        }

        return redirect()->back()->with('status', 'Pengaturan sistem berhasil diperbarui.');
    }

    /**
     * Halaman Kelola Konten & Tampilan Landing Page Utama
     */
    public function kelolaLanding()
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
                    return 'Sistem Antrean & Informasi SPMB SMAN 1 Slawi ini merupakan hasil karya pengabdian masyarakat dari Kelompok KKN Sahabat Sekolah Jawa Tengah 001 Universitas Muhammadiyah Yogyakarta Periode Genap 2025/2026.';
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

        return Inertia::render('Admin/LandingSettings', [
            'landingSettings' => $landingSettings,
        ]);
    }

    /**
     * Simpan Perubahan Landing Page oleh Admin/Guru
     */
    public function simpanLanding(Request $request)
    {
        $data = $request->validate([
            'site_title' => 'nullable|string',
            'header_subtitle' => 'nullable|string',
            'hero_badge' => 'required|string',
            'hero_title' => 'required|string',
            'hero_subtitle' => 'required|string',
            'hero_desc' => 'required|string',
            'hero_slogan' => 'required|string',

            'linimasa' => 'required|array',
            'jalurSeleksi' => 'required|array',
            'dokumenReq' => 'required|array',
            'mapelPenilaian' => 'required|array',

            'linktree_url' => 'nullable|string',
            'wa_group_url' => 'nullable|string',
            'narahubung' => 'required|array',

            'alamat' => 'required|string',
            'website_url' => 'nullable|string',
            'instagram_url' => 'nullable|string',
            'youtube_url' => 'nullable|string',
            'footer_desc' => 'nullable|string',
            'footer_copyright' => 'nullable|string',

            'tabs' => 'nullable|array',
        ]);

        \App\Models\PengaturanSistem::set('landing_site_title', $data['site_title'] ?? 'Portal Resmi SPMB');
        \App\Models\PengaturanSistem::set('landing_header_subtitle', $data['header_subtitle'] ?? 'PORTAL RESMI SPMB');
        \App\Models\PengaturanSistem::set('landing_hero_badge', $data['hero_badge']);
        \App\Models\PengaturanSistem::set('landing_hero_title', $data['hero_title']);
        \App\Models\PengaturanSistem::set('landing_hero_subtitle', $data['hero_subtitle']);
        \App\Models\PengaturanSistem::set('landing_hero_desc', $data['hero_desc']);
        \App\Models\PengaturanSistem::set('landing_hero_slogan', $data['hero_slogan']);

        \App\Models\PengaturanSistem::set('landing_linimasa', json_encode(array_values($data['linimasa']), JSON_UNESCAPED_UNICODE));
        \App\Models\PengaturanSistem::set('landing_jalur_seleksi', json_encode(array_values($data['jalurSeleksi']), JSON_UNESCAPED_UNICODE));
        \App\Models\PengaturanSistem::set('landing_dokumen_req', json_encode(array_values($data['dokumenReq']), JSON_UNESCAPED_UNICODE));
        \App\Models\PengaturanSistem::set('landing_mapel_penilaian', json_encode(array_values($data['mapelPenilaian']), JSON_UNESCAPED_UNICODE));

        \App\Models\PengaturanSistem::set('landing_linktree_url', $data['linktree_url'] ?? '');
        \App\Models\PengaturanSistem::set('landing_wa_group_url', $data['wa_group_url'] ?? '');
        \App\Models\PengaturanSistem::set('landing_narahubung', json_encode(array_values($data['narahubung']), JSON_UNESCAPED_UNICODE));

        \App\Models\PengaturanSistem::set('landing_alamat', $data['alamat']);
        \App\Models\PengaturanSistem::set('landing_website_url', $data['website_url'] ?? '');
        \App\Models\PengaturanSistem::set('landing_instagram_url', $data['instagram_url'] ?? '');
        \App\Models\PengaturanSistem::set('landing_youtube_url', $data['youtube_url'] ?? '');
        \App\Models\PengaturanSistem::set('landing_footer_desc', $data['footer_desc'] ?? '');
        \App\Models\PengaturanSistem::set('landing_footer_copyright', $data['footer_copyright'] ?? '');

        if (isset($data['tabs'])) {
            \App\Models\PengaturanSistem::set('landing_tabs', json_encode(array_values($data['tabs']), JSON_UNESCAPED_UNICODE));
        }

        return redirect()->back()->with('status', 'Konfigurasi Konten Halaman Utama (Landing Page) Berhasil Diperbarui!');
    }
}
