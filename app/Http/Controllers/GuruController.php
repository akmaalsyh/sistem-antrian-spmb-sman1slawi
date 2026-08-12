<?php

namespace App\Http\Controllers;

use App\Models\Antrean;
use App\Models\JadwalKuota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class GuruController extends Controller
{
    /**
     * Helper untuk mengambil tanggal aktif antrean
     */
    private function getActiveTanggal($requestedTanggal = null)
    {
        if ($requestedTanggal) {
            return $requestedTanggal;
        }

        $today = Carbon::today()->format('Y-m-d');
        
        // Cek apakah ada antrean hari ini
        $hasAntreanToday = Antrean::whereHas('jadwal', fn($q) => $q->where('tanggal', $today))->exists();

        if ($hasAntreanToday) {
            return $today;
        }

        // Jika tidak ada antrean hari ini, cari tanggal jadwal paling pertama yang memiliki antrean
        $latestAntrean = Antrean::with('jadwal')->latest('id')->first();
        if ($latestAntrean && $latestAntrean->jadwal) {
            return $latestAntrean->jadwal->tanggal;
        }

        return $today;
    }

    /**
     * Dashboard Verifikator / Guru (Tampilan Kontrol Meja & Antrean)
     */
    public function dashboard(Request $request)
    {
        $selectedTanggal = $this->getActiveTanggal($request->input('tanggal'));
        $selectedLoket = $request->input('loket', session('selected_loket', null));

        // Save/clear selected loket in session
        if ($request->has('loket')) {
            $loketVal = $request->input('loket');
            if (empty($loketVal)) {
                session()->forget('selected_loket');
                $selectedLoket = null;
            } else {
                session(['selected_loket' => $loketVal]);
                $selectedLoket = $loketVal;
            }
        }

        // Ambil seluruh daftar tanggal jadwal kuota yang memiliki pendaftar antrean (untuk dropdown pilihan tanggal di meja)
        $daftarTanggalTersedia = JadwalKuota::whereHas('antrean')
            ->orderBy('tanggal', 'asc')
            ->get();

        // Ambil data jadwal kuota hari terpilih
        $jadwalHariIni = JadwalKuota::where('tanggal', $selectedTanggal)->first();

        // Ambil daftar seluruh antrean pada tanggal terpilih
        $daftarAntrean = Antrean::with('user')
            ->whereHas('jadwal', function ($q) use ($selectedTanggal) {
                $q->where('tanggal', $selectedTanggal);
            })
            ->orderBy('id', 'asc')
            ->get();

        // Antrean yang sedang dilayani / dipanggil di LOKET INI (atau secara umum jika loket belum diset)
        $antreanAktifQuery = Antrean::with('user')
            ->whereHas('jadwal', function ($q) use ($selectedTanggal) {
                $q->where('tanggal', $selectedTanggal);
            })
            ->where('status', 'Dilayani');

        if ($selectedLoket) {
            $antreanAktifQuery->where('loket', $selectedLoket);
        }

        $antreanAktif = $antreanAktifQuery->first();

        // Antrean selanjutnya yang menunggu
        $antreanBerikutnya = $daftarAntrean->firstWhere('status', 'Menunggu');

        // Statistik Ringkas
        $totalAntrean = $daftarAntrean->count();
        $totalSelesai = $daftarAntrean->where('status', 'Selesai')->count();
        $totalMenunggu = $daftarAntrean->where('status', 'Menunggu')->count();
        $totalDilayani = $daftarAntrean->where('status', 'Dilayani')->count();

        return Inertia::render('Guru/Dashboard', [
            'selectedTanggal' => $selectedTanggal,
            'selectedLoket' => $selectedLoket,
            'daftarTanggalTersedia' => $daftarTanggalTersedia,
            'jadwalHariIni' => $jadwalHariIni,
            'daftarAntrean' => $daftarAntrean,
            'antreanAktif' => $antreanAktif,
            'antreanBerikutnya' => $antreanBerikutnya,
            'statistik' => [
                'total' => $totalAntrean,
                'selesai' => $totalSelesai,
                'menunggu' => $totalMenunggu,
                'dilayani' => $totalDilayani,
            ],
            'petugas' => Auth::user(),
        ]);
    }

    /**
     * Pilih / Ganti Meja Loket
     */
    public function pilihLoket(Request $request)
    {
        $loket = $request->input('loket', '');
        
        if (empty($loket)) {
            session()->forget('selected_loket');
            return redirect()->route('guru.dashboard', ['loket' => '']);
        }

        $request->validate([
            'loket' => 'required|string',
        ]);

        session(['selected_loket' => $loket]);

        return redirect()->route('guru.dashboard', ['loket' => $loket, 'tanggal' => $request->input('tanggal')]);
    }

    /**
     * Panggil Antrean Selanjutnya (Mengubah status antrean menjadi 'Dilayani')
     */
    public function panggil(Request $request)
    {
        $request->validate([
            'antrean_id' => 'required|exists:antrean,id',
            'loket' => 'required|string',
        ]);

        $antrean = Antrean::findOrFail($request->antrean_id);
        
        // Selesaikan antrean yang sedang dilayani di loket ini sebelumnya jika ada
        Antrean::where('status', 'Dilayani')
            ->where('loket', $request->loket)
            ->update(['status' => 'Selesai']);

        $antrean->update([
            'status' => 'Dilayani',
            'loket' => $request->loket,
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('status', 'Nomor antrean ' . $antrean->nomor_urut . ' dipanggil ke ' . $request->loket);
    }

    public function panggilUlang(Request $request)
    {
        $request->validate([
            'antrean_id' => 'required|exists:antrean,id',
        ]);

        $antrean = Antrean::findOrFail($request->antrean_id);
        $antrean->timestamps = false;
        $antrean->updated_at = now();
        $antrean->save();
        $antrean->timestamps = true;

        // Force touch database record timestamp
        Antrean::where('id', $antrean->id)->update(['updated_at' => now()]);

        return redirect()->back()->with('status', 'Nomor antrean ' . $antrean->nomor_urut . ' dipanggil ulang');
    }

    /**
     * Selesaikan Verifikasi Berkas (Mengubah status menjadi 'Selesai')
     */
    public function selesai(Request $request)
    {
        $request->validate([
            'antrean_id' => 'required|exists:antrean,id',
        ]);

        $antrean = Antrean::findOrFail($request->antrean_id);
        $antrean->update([
            'status' => 'Selesai',
        ]);

        return redirect()->back()->with('status', 'Verifikasi berkas antrean ' . $antrean->nomor_urut . ' selesai!');
    }

    /**
     * Tampilan Monitor Layar Besar (Display Screen Publik)
     */
    public function monitor()
    {
        $selectedTanggal = $this->getActiveTanggal();

        $antreanAktif = Antrean::with('user')
            ->whereHas('jadwal', function ($q) use ($selectedTanggal) {
                $q->where('tanggal', $selectedTanggal);
            })
            ->where('status', 'Dilayani')
            ->orderBy('updated_at', 'desc')
            ->first();

        $riwayatPanggilan = Antrean::with('user')
            ->whereHas('jadwal', function ($q) use ($selectedTanggal) {
                $q->where('tanggal', $selectedTanggal);
            })
            ->whereIn('status', ['Dilayani', 'Selesai'])
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        $statistik = [
            'total' => Antrean::whereHas('jadwal', fn($q) => $q->where('tanggal', $selectedTanggal))->count(),
            'menunggu' => Antrean::whereHas('jadwal', fn($q) => $q->where('tanggal', $selectedTanggal))->where('status', 'Menunggu')->count(),
            'dilayani' => Antrean::whereHas('jadwal', fn($q) => $q->where('tanggal', $selectedTanggal))->where('status', 'Dilayani')->count(),
            'selesai' => Antrean::whereHas('jadwal', fn($q) => $q->where('tanggal', $selectedTanggal))->where('status', 'Selesai')->count(),
        ];

        return Inertia::render('Monitor/Index', [
            'antreanAktif' => $antreanAktif,
            'riwayatPanggilan' => $riwayatPanggilan,
            'statistik' => $statistik,
        ]);
    }

    /**
     * API Data Realtime Monitor
     */
    public function monitorData()
    {
        $selectedTanggal = $this->getActiveTanggal();

        $antreanAktif = Antrean::with('user')
            ->whereHas('jadwal', function ($q) use ($selectedTanggal) {
                $q->where('tanggal', $selectedTanggal);
            })
            ->where('status', 'Dilayani')
            ->orderBy('updated_at', 'desc')
            ->first();

        $riwayatPanggilan = Antrean::with('user')
            ->whereHas('jadwal', function ($q) use ($selectedTanggal) {
                $q->where('tanggal', $selectedTanggal);
            })
            ->whereIn('status', ['Dilayani', 'Selesai'])
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        if ($antreanAktif) {
            $antreanAktif->updated_at_timestamp = $antreanAktif->updated_at ? $antreanAktif->updated_at->timestamp : time();
        }

        return response()->json([
            'antreanAktif' => $antreanAktif,
            'riwayatPanggilan' => $riwayatPanggilan,
        ]);
    }
}
