<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JadwalKuota;
use App\Models\Antrean;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AntreanController extends Controller
{
    // Fungsi untuk halaman depan (Kios) yang belum login
    public function index()
    {
        $jadwal = JadwalKuota::where('status_buka', true)
                             ->where('tanggal', '>=', now()->format('Y-m-d'))
                             ->orderBy('tanggal', 'asc')
                             ->get();

        return Inertia::render('Kios', [
            'jadwal' => $jadwal
        ]);
    }

    // Fungsi untuk halaman Dashboard Siswa (setelah login)
    public function dashboard()
    {
        $user = Auth::user();

        // 1. Cek apakah siswa ini sudah pernah mengambil antrean
        // Kita gunakan 'with('jadwal')' untuk menarik data tanggalnya sekaligus
        $antreanSiswa = Antrean::with('jadwal')->where('user_id', $user->id)->first();

        // 2. Ambil daftar jadwal jika siswa belum punya antrean
        $jadwalTersedia = JadwalKuota::where('status_buka', true)
                             ->where('tanggal', '>=', now()->format('Y-m-d'))
                             ->orderBy('tanggal', 'asc')
                             ->get();

        // 3. Kirim kedua data tersebut ke React (Dashboard.jsx)
        return Inertia::render('Dashboard', [
            'antreanSiswa' => $antreanSiswa,
            'jadwalTersedia' => $jadwalTersedia
        ]);
    }
}