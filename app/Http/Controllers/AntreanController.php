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
     * Hitung Estimasi Jam Kedatangan (Format Jam Mulai Saja)
     * Asumsi: 
     * - 5 Loket / Meja Verifikasi Aktif
     * - Durasi Verifikasi: 10 Menit / Siswa
     * - Jam Operasional: Dimulai 07:30 WIB
     */
    private function hitungEstimasiJam($urutanIndeks)
    {
        $jumlahLoket = 5;
        $durasiMenitPerSiswa = 10;
        
        // Menghitung gelombang/batch keberangkatan
        $batch = floor($urutanIndeks / $jumlahLoket);
        $tambahanMenit = $batch * $durasiMenitPerSiswa;

        // Mulai Jam Operasional 07:30 WIB
        $jamMulai = Carbon::createFromTime(7, 30, 0);
        $jamEstimasi = $jamMulai->copy()->addMinutes($tambahanMenit);

        // Jika melewati jam 12:00 (ISOMA), tambah 60 menit
        if (($jamEstimasi->hour == 12 && $jamEstimasi->minute > 0) || $jamEstimasi->hour > 12) {
            $jamEstimasi->addHour();
        }

        return $jamEstimasi->format('H:i');
    }

    // Halaman depan Landing Page
    public function index()
    {
        return Inertia::render('Welcome');
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

        return Inertia::render('Etiket', [
            'antreanSiswa' => $antreanSiswa,
            'jadwalTersedia' => $jadwalTersedia
        ]);
    }

    // Halaman Cek Berkas Persyaratan Siswa
    public function cekBerkas()
    {
        return Inertia::render('CekBerkas');
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

            return redirect()->route('etiket')->with('success', 'Nomor antrean berhasil diambil!');
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

            return redirect()->route('etiket')->with('status', 'Tiket antrean berhasil dibatalkan. Kuota harian telah dikembalikan.');
        });
    }
}